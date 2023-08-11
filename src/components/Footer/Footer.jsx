import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

import './Footer.css';

class Footer extends React.Component {
  render() {
    if (this.props.tabs[0].selected) {
      if (this.props.movieArray.length) {
        return (
          <footer className="footer">
            <Pagination
              defaultCurrent={1}
              current={this.props.tabs[0].selectedPageNumber}
              pageSize={1}
              total={this.props.moviePages}
              onChange={this.props.changePage}
            />
          </footer>
        );
      }
    } else {
      return (
        <footer className="footer">
          <Pagination
            defaultCurrent={1}
            current={this.props.tabs[1].selectedPageNumber}
            pageSize={1}
            total={this.props.ratedMoviePages}
            onChange={this.props.changePage}
          />
        </footer>
      );
    }
  }
}

Footer.defaultProps = {
  movieArray: {},
  tabs: {},
  moviePages: null,
  changePage: () => {},
};
Footer.propTypes = {
  movieArray: PropTypes.arrayOf(PropTypes.object),
  tabs: PropTypes.arrayOf(PropTypes.object),
  moviePages: PropTypes.number,
  changePage: PropTypes.func,
};

export default Footer;
