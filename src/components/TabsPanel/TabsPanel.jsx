import React from 'react';
import PropTypes from 'prop-types';

import './TabsPanel.css';

class TabsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.handle = (event) => {
      event.target.className = 'selected';
    };
  }

  render() {
    const buttons = this.props.tabs.map((element) => {
      return (
        <button key={element.id} className={element.class} type="button" onClick={this.props.selectTab}>
          {element.value}
        </button>
      );
    });
    return <div className="tabs-panel">{buttons}</div>;
  }
}

TabsPanel.defaultProps = {
  tabs: {},
  selectTab: () => {},
};
TabsPanel.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  selectTab: PropTypes.func,
};

export default TabsPanel;
