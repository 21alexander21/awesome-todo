// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, type Location } from 'react-router';
import Tabs from '@skbkontur/react-ui/Tabs';
import './assets/styles/styles.css';

type NavigationProps = {
  location: Location,
  fetching: boolean,
};

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

class Navigation extends React.Component<NavigationProps> {
  static defaultProps = {
    className: null,
  };

  getClassName = (): string => {
    const classNames = ['navigation'];

    if (this.props.fetching) {
      classNames.push('navigation--fetching');
    }

    return classNames.join(' ');
  };

  render() {
    return (
      <div className={this.getClassName()}>
        <Tabs value={getFilterFromLocation(this.props.location)}>
          <Tabs.Tab component={Link} to="/" id="default">
            All
          </Tabs.Tab>
          <Tabs.Tab component={Link} to="/active" id="active">
            Active
          </Tabs.Tab>
          <Tabs.Tab component={Link} to="/completed" id="completed">
            Completed
          </Tabs.Tab>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(Navigation);
