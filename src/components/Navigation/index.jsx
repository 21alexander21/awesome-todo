import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Tabs from '@skbkontur/react-ui/Tabs';
import './assets/styles/styles.css';

const getFilterFromLocation = (location) => {
  switch (location.pathname) {
    case '/active':
      return 'active';

    case '/completed':
      return 'completed';

    default:
      return 'default';
  }
};

class Navigation extends React.Component {
  changeLocation(filter) {
    let newLocation = '/';
    switch (filter) {
      case 'active':
        newLocation = '/active';
        break;

      case 'completed':
        newLocation = '/completed';
        break;

      default:
        break;
    }

    this.props.history.push(newLocation);
  }

  render() {
    return (
      <div className={`navigation ${this.props.className ? this.props.className : ''}`}>
        <Tabs
          value={getFilterFromLocation(this.props.location)}
          onChange={(event, filter) => this.changeLocation(filter)}
        >
          <Tabs.Tab id="default">All</Tabs.Tab>
          <Tabs.Tab id="active">Active</Tabs.Tab>
          <Tabs.Tab id="completed">Completed</Tabs.Tab>
        </Tabs>
      </div>
    );
  }
}

Navigation.propTypes = {
  className: PropTypes.string,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Navigation.defaultProps = {
  className: null,
};

export default withRouter(Navigation);
