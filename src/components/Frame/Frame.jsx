import React from 'react';
import { Rate, Space, Alert } from 'antd';
import PropTypes from 'prop-types';

import { Consumer } from '../../context/GenreContext';
import './Frame.css';
import image from '../../assets/images/Rectangle 36.png';

class Frame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rateSuccess: true,
      rating: this.props.rating,
    };

    this.textSize = (text) => {
      const textArray = text.split(' ');
      let lineNumber = 1;
      const space = 3;
      const lineCapacity = 20;
      textArray.reduce((sum, element) => {
        if (sum + element.length + space > lineCapacity) {
          lineNumber++;
          return 0;
        }
        return sum + element.length + 1;
      }, 0);
      const lineHeight = 28;
      const textHeight = lineNumber * lineHeight;
      return textHeight;
    };

    this.genreBoxSize = (genres) => {
      let lineNumber = 1;
      const space = 6;
      const lineCapacity = 45;
      genres.reduce((sum, element) => {
        if (sum + element.props.children.length + space > lineCapacity) {
          lineNumber++;
          return 0;
        }
        return sum + element.props.children.length + 3;
      }, 0);
      const lineHeight = 37;
      const boxHeight = lineNumber * lineHeight;
      return boxHeight;
    };
  }

  changeValue = (value) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value":${value}}`,
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${this.props.id}/rating?guest_session_id=${this.props.guestSession}&api_key=ee60b68613c90cbd5be3c6ec998aa678`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          this.setState({
            rating: value,
          });
        }
      })
      .catch(() => {
        this.setState({
          rateSuccess: false,
        });
      });
  };

  cutOverview = (title, genres, overview) => {
    const titleSize = this.textSize(title);
    const dateSize = 29;
    const genresSize = this.genreBoxSize(genres);
    const boxHeight = 220;
    const overviewSize = boxHeight - (titleSize + dateSize + genresSize);
    const lineHeight = 22;
    const lineCapacity = 40;
    const overviewMaxLength = Math.floor(overviewSize / lineHeight) * lineCapacity;
    if (overview.length > overviewMaxLength) {
      const shortOverview = overview.slice(0, overviewMaxLength);
      let index;
      for (let i = shortOverview.length - 1; i >= 0; i--) {
        const noLetterChar = shortOverview.charCodeAt(i);
        if (noLetterChar < 48 || (noLetterChar > 57 && noLetterChar < 65) || noLetterChar > 122) {
          index = i;
          break;
        }
      }
      overview = `${shortOverview.slice(0, index)} ...`;
    }
    return overview;
  };

  onClose = () => {
    this.setState({
      rateSuccess: true,
    });
  };

  render() {
    const { poster, voteAverage, title, releaseDate, genreIds, overview } = this.props;
    const posterUrl = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
    const getPoster = poster ? posterUrl + poster : image;
    const color = () => {
      if (voteAverage <= 3) {
        return 'red-rating';
      }
      if (voteAverage <= 5) {
        return 'orange-rating';
      }
      if (voteAverage <= 7) {
        return 'yellow-rating';
      }
      return 'green-rating';
    };
    const getGenres = (list) => {
      const genreNames = [];
      genreIds.forEach((element) => {
        const genreName = list.find((item) => item.id === element);
        genreNames.push(
          <span key={genreName.id} className="genre">
            {genreName.name}
          </span>
        );
      });
      if (!genreNames.length) {
        genreNames.push(
          <span key={'NA'} className="genre">
            NA
          </span>
        );
      }
      return genreNames;
    };

    return (
      <div className="frame">
        <figure className="frame-img-container">
          <img src={getPoster} className="frame-img" alt="Movie Poster" />
        </figure>
        <div className="frame-description-container">
          <div className="frame-description">
            <figure className="frame-img-container">
              <img src={getPoster} className="frame-img" alt="Movie Poster" />
            </figure>
            <div className="title-container">
              <h5 className="movie-title">{title}</h5>
              <div className={`vote-average ${color()}`}>
                <span>{Math.round(voteAverage * 10) / 10}</span>
              </div>
            </div>
            <div className="release-date">
              <span>{releaseDate || 'NA'}</span>
            </div>
            <Consumer>
              {(genreList) => (
                <div>
                  <div className="genre-list">{getGenres(genreList)}</div>
                  <div className="movie-details">
                    <span>{this.cutOverview(title, getGenres(genreList), overview)}</span>
                  </div>
                </div>
              )}
            </Consumer>
          </div>
          {!this.state.rateSuccess && (
            <Space direction="vertical">
              <Alert
                message="Request Error"
                description="Try to rate movie again."
                type="error"
                closable
                onClose={this.onClose}
              />
            </Space>
          )}
          <Rate allowHalf count={10} onChange={this.changeValue} value={this.state.rating} />
        </div>
      </div>
    );
  }
}

Frame.defaultProps = {
  id: null,
  guestSession: '',
  poster: '',
  voteAverage: null,
  title: '',
  releaseDate: '',
  genreIds: {},
  overview: '',
  rating: null,
};
Frame.propTypes = {
  id: PropTypes.number,
  guestSession: PropTypes.string,
  poster: PropTypes.string,
  voteAverage: PropTypes.number,
  title: PropTypes.string,
  releaseDate: PropTypes.string,
  genreIds: PropTypes.array,
  overview: PropTypes.string,
  rating: PropTypes.number,
};

export default Frame;
