import React from "react";
import TabsPanel from "../TabsPanel";
import SearchPanel from "../SearchPanel";
import PropTypes from "prop-types";

import "./Header.css";

class Header extends React.Component {
  render() {
    const { tabs, selectTab, inputValue, changeInputValue } = this.props;
    return (
      <header className='header'>
        <TabsPanel tabs={tabs} selectTab={selectTab} />
        {tabs[0].selected && (
          <SearchPanel
            inputValue={inputValue}
            changeInputValue={changeInputValue}
          />
        )}
      </header>
    );
  }
}

Header.defaultProps = {
  tabs: {},
  selectTab: () => {},
  inputValue: "",
  changeInputValue: () => {},
};
Header.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  selectTab: PropTypes.func,
  inputValue: PropTypes.string,
  changeInputValue: PropTypes.func,
};

export default Header;
