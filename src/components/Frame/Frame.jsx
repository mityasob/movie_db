import React from "react";
import { Rate, Space, Alert } from "antd";
import PropTypes from "prop-types";

import "./Frame.css";
import image from "./Rectangle 36.png";
import { Consumer } from "../GenreContext";

class Frame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rateSuccess: true,
    };
  }

  changeValue = (value) => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: `{"value":${value}}`,
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${this.props.id}/rating?guest_session_id=${this.props.guestSession}&api_key=ee60b68613c90cbd5be3c6ec998aa678`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          rateSuccess: response.success,
        });
      })
      .catch(() => {
        this.setState({
          rateSuccess: false,
        });
      });
  };

  textSize = (text) => {
    const textArray = text.split(" ");
    let lineNumber = 1;
    textArray.reduce((sum, element) => {
      if (sum + element.length + 3 > 20) {
        lineNumber++;
        return 0;
      } else {
        return sum + element.length + 1;
      }
    }, 0);
    let lineHeight = lineNumber * 28;
    return lineHeight;
  };

  genreBoxSize(genres) {
    let lineNumber = 1;
    genres.reduce((sum, element) => {
      if (sum + element.props.children.length + 6 > 45) {
        lineNumber++;
        return 0;
      } else {
        return sum + element.props.children.length + 3;
      }
    }, 0);
    let lineHeight = lineNumber * 37;
    return lineHeight;
  }

  cutOverview = (title, genres, overview) => {
    const titleSize = this.textSize(title);
    const dateSize = 29;
    const genresSize = this.genreBoxSize(genres);
    const overviewSize = 220 - (titleSize + dateSize + genresSize);
    const overviewMaxLength = Math.floor(overviewSize / 22) * 40;
    if (overview.length > overviewMaxLength) {
      let shortOverview = overview.slice(0, overviewMaxLength);
      let index;
      for (let i = shortOverview.length - 1; i >= 0; i--) {
        if (
          shortOverview.charCodeAt(i) < 48 ||
          (shortOverview.charCodeAt(i) > 57 &&
            shortOverview.charCodeAt(i) < 65) ||
          shortOverview.charCodeAt(i) > 122
        ) {
          index = i;
          break;
        }
      }
      overview = shortOverview.slice(0, index) + " ...";
    }
    return overview;
  };

  onClose = () => {
    this.setState({
      rateSuccess: true,
    });
  };

  render() {
    const {
      poster,
      voteAverage,
      title,
      releaseDate,
      genreIds,
      overview,
      rating,
    } = this.props;
    const posterUrl = "https://www.themoviedb.org/t/p/w220_and_h330_face";
    const getPoster = poster ? posterUrl + poster : image;
    const color = () => {
      if (voteAverage <= 3) {
        return "red-rating";
      } else if (voteAverage <= 5) {
        return "orange-rating";
      } else if (voteAverage <= 7) {
        return "yellow-rating";
      } else {
        return "green-rating";
      }
    };

    return (
      <div className='frame'>
        <figure className='frame-img-container'>
          <img src={getPoster} className='frame-img' alt='Movie Poster' />
        </figure>
        <div className='frame-description-container'>
          <div className='frame-description'>
            <figure className='frame-img-container'>
              <img src={getPoster} className='frame-img' alt='Movie Poster' />
            </figure>
            <div className='title-container'>
              <h5 className='movie-title'>{title}</h5>
              <div className={`vote-average ${color()}`}>
                <span>{Math.round(voteAverage * 10) / 10}</span>
              </div>
            </div>
            <div className='release-date'>
              <span>{releaseDate ? releaseDate : "NA"}</span>
            </div>
            <Consumer>
              {(genreList) => {
                const genreNames = [];
                genreIds.forEach((element) => {
                  const genreName = genreList.find(
                    (item) => item.id === element
                  );
                  genreNames.push(
                    <span key={genreName.id} className='genre'>
                      {genreName.name}
                    </span>
                  );
                });
                if (!genreNames.length) {
                  genreNames.push(
                    <span key={"NA"} className='genre'>
                      NA
                    </span>
                  );
                }
                return (
                  <div>
                    <div className='genre-list'>{genreNames}</div>
                    <div className='movie-details'>
                      <span>
                        {this.cutOverview(title, genreNames, overview)}
                      </span>
                    </div>
                  </div>
                );
              }}
            </Consumer>
          </div>
          {!this.state.rateSuccess && (
            <Space direction='vertical'>
              <Alert
                message='Request Error'
                description='Try to rate movie again.'
                type='error'
                closable
                onClose={this.onClose}
              />
            </Space>
          )}
          <div className='rate-container'>
            <Rate
              allowHalf
              count={10}
              onChange={this.changeValue}
              value={rating}
            />
          </div>
        </div>
      </div>
    );
  }
}

Frame.defaultProps = {
  id: null,
  guestSession: "",
  poster: "",
  voteAverage: null,
  title: "",
  releaseDate: {},
  genreIds: null,
  overview: "",
  rating: null,
};
Frame.propTypes = {
  id: PropTypes.number,
  guestSession: PropTypes.string,
  poster: PropTypes.string,
  voteAverage: PropTypes.number,
  title: PropTypes.string,
  releaseDate: PropTypes.object,
  genreIds: PropTypes.string,
  overview: PropTypes.string,
  rating: PropTypes.number,
};

export default Frame;
