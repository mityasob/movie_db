import React from 'react';
import { Spin } from 'antd';
import { Alert, Space } from 'antd';
import { debounce } from 'lodash';

import Container from '../Container';
import Header from '../Header';
import Footer from '../Footer';
import './App.css';
import { Provider } from '../GenreContext';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieArray: [],
      moviePages: null,
      ratedMovieArray: [],
      ratedMoviePages: null,
      isLoaded: true,
      error: false,
      inputValue: '',
      tabs: [
        {
          id: 1,
          class: 'tab selected',
          value: 'Search',
          selectedPageNumber: 1,
          selected: true,
        },
        {
          id: 2,
          class: 'tab',
          value: 'Rated',
          selectedPageNumber: 1,
          selected: false,
        },
      ],
      guestSession: '',
      genreList: [],
    };

    this.options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    this.createCard = (movie) => {
      return {
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        overview: movie.overview,
        poster: movie.poster_path,
        voteAverage: movie.vote_average,
        rating: movie.rating,
        genreIds: movie.genre_ids,
      };
    };
  }

  componentDidMount() {
    this.getGenreList();
    fetch(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=ee60b68613c90cbd5be3c6ec998aa678',
      this.options
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          guestSession: response.guest_session_id,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  }

  selectTab = (event) => {
    this.getMovies(this.state.inputValue);
    const newTabs = this.state.tabs.slice();
    newTabs.forEach((element) => {
      if (element.value === event.target.innerHTML) {
        element.class = 'tab selected';
        element.selected = true;
      } else {
        element.class = 'tab';
        element.selected = false;
      }
    });
    this.setState({
      tabs: newTabs,
    });
  };

  changeInputValue = (event) => {
    this.setState({
      inputValue: event.target.value === ' ' ? '' : event.target.value,
    });
  };

  getMovies = (value = 'return') => {
    if (this.state.guestSession) {
      this.getRatedList();
    }
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${value}&page=${this.state.tabs[0].selectedPageNumber}&api_key=ee60b68613c90cbd5be3c6ec998aa678`,
      this.options
    )
      .then((response) => response.json())
      .then((response) => {
        const newMovieArray = [];
        for (let i = 0; i < response.results.length; i++) {
          const movieId = this.state.ratedMovieArray.find((element) => element.id === response.results[i].id);
          if (movieId) {
            newMovieArray.push(movieId);
          } else {
            newMovieArray.push(this.createCard(response.results[i]));
          }
        }
        this.setState({
          movieArray: newMovieArray,
          moviePages: response.total_pages,
          isLoaded: true,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  };

  getRatedList() {
    fetch(
      `https://api.themoviedb.org/3/guest_session/${this.state.guestSession}/rated/movies?page=${this.state.tabs[1].selectedPageNumber}&api_key=ee60b68613c90cbd5be3c6ec998aa678`,
      this.options
    )
      .then((response) => response.json())
      .then((response) => {
        const newMovieArray = [];
        for (let i = 0; i < response.results.length; i++) {
          newMovieArray.push(this.createCard(response.results[i]));
        }
        this.setState({
          ratedMovieArray: newMovieArray,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  }

  componentDidUpdate = debounce((prevProps, prevState) => {
    if (
      this.state.inputValue !== prevState.inputValue ||
      this.state.tabs[0].selectedPageNumber !== prevState.tabs[0].selectedPageNumber ||
      this.state.tabs[1].selectedPageNumber !== prevState.tabs[1].selectedPageNumber ||
      this.state.tabs[0].selected !== prevState.tabs[0].selected
    ) {
      this.setState({
        isLoaded: false,
      });
      this.getMovies(this.state.inputValue);
    }
  }, 1000);

  onClose = () => {
    this.setState({
      error: false,
      inputValue: '',
    });
  };

  changePage = (page) => {
    if (this.state.tabs[0].selected) {
      const tabState = { ...this.state.tabs[0], selectedPageNumber: page };
      this.setState({
        tabs: [tabState, this.state.tabs[1]],
      });
    } else {
      const tabState = { ...this.state.tabs[1], selectedPageNumber: page };
      this.setState({
        tabs: [this.state.tabs[0], tabState],
      });
    }
  };

  getGenreList = () => {
    fetch(
      'https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=ee60b68613c90cbd5be3c6ec998aa678',
      this.options
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          genreList: response.genres,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  };

  render() {
    const { ...rest } = this.state;

    if (rest.error) {
      return (
        <Provider value={rest.genreList}>
          <section className="movie-db">
            <Header tabs={rest.tabs} selectTab={this.selectTab} />
            <Space direction="vertical">
              <Alert
                message="Request Error"
                description="Close window and start new search or refresh window"
                type="error"
                closable
                onClose={this.onClose}
              />
            </Space>
          </section>
        </Provider>
      );
    }
    if (!rest.isLoaded) {
      return (
        <Provider value={rest.genreList}>
          <section className="movie-db">
            <Header tabs={rest.tabs} selectTab={this.selectTab} />
            <div className="spin-container">
              <Spin />
            </div>
            <Footer
              tabs={rest.tabs}
              changePage={this.changePage}
              movieArray={rest.movieArray}
              moviePages={rest.moviePages}
              ratedMovieArray={rest.ratedMovieArray}
              ratedMoviePages={rest.ratedMoviePages}
            />
          </section>
        </Provider>
      );
    }
    return (
      <Provider value={rest.genreList}>
        <section className="movie-db">
          <Header
            tabs={rest.tabs}
            inputValue={rest.inputValue}
            changeInputValue={this.changeInputValue}
            selectTab={this.selectTab}
          />
          <Container
            movieArray={rest.movieArray}
            ratedMovieArray={rest.ratedMovieArray}
            tabs={rest.tabs}
            guestSession={rest.guestSession}
          />
          <Footer
            tabs={rest.tabs}
            changePage={this.changePage}
            movieArray={rest.movieArray}
            moviePages={rest.moviePages}
            ratedMovieArray={rest.ratedMovieArray}
            ratedMoviePages={rest.ratedMoviePages}
          />
        </section>
      </Provider>
    );
  }
}

export default App;
