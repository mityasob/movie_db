import React from "react";
import PropTypes from 'prop-types';

import Frame from "../Frame";
import "./Container.css";

class Container extends React.Component {
  render() {
    const { movieArray, ratedMovieArray, tabs, guestSession } = this.props;
    const movieFrames = movieArray.map((element) => {
      return (
        <Frame
          key={element.id}
          id={element.id}
          title={element.title}
          releaseDate={element.releaseDate}
          overview={element.overview}
          poster={element.poster}
          rating={element.rating}
          voteAverage={element.voteAverage}
          genreIds={element.genreIds}
          guestSession={guestSession}
          ratedMovieArray={ratedMovieArray}
        />
      );
    });
    const ratedMoviFrames = ratedMovieArray.map((element) => {
      return (
        <Frame
          key={element.id}
          id={element.id}
          title={element.title}
          releaseDate={element.releaseDate}
          overview={element.overview}
          poster={element.poster}
          rating={element.rating}
          voteAverage={element.voteAverage}
          genreIds={element.genreIds}
          guestSession={guestSession}
          ratedMovieArray={ratedMovieArray}
        />
      );
    });
    const movieList = tabs[0].selected ? movieFrames : ratedMoviFrames;

    return <section className='container'>{movieList}</section>;
  }
}

Container.defaultProps = {
  movieArray: {},
  ratedMovieArray: {}, 
  tabs: {},
  guestSession: "",
};
Container.propTypes = {
  movieArray: PropTypes.arrayOf(PropTypes.object),
  ratedMovieArray: PropTypes.arrayOf(PropTypes.object), 
  tabs: PropTypes.arrayOf(PropTypes.object),
  guestSession: PropTypes.string,
};

export default Container;
