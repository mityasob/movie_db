import React from "react";
import PropTypes from "prop-types";

import "./SearchPanel.css";

class SearchPanel extends React.Component {
  render() {
    return (
      <div className='search-panel'>
        <input
          type='search'
          className='search-input'
          placeholder='Type to search...'
          autoFocus
          onChange={this.props.changeInputValue}
        />
      </div>
    );
  }
}

SearchPanel.defaultProps = {
  changeInputValue: () => {},
};
SearchPanel.propTypes = {
  changeInputValue: PropTypes.func,
};

export default SearchPanel;
