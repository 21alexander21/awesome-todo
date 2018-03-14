// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import Tabs from '@skbkontur/react-ui/Tabs';
import './assets/styles/styles.css';

type NavigationProps = {
  className?: string,
  location: {
    pathname: string,
  },
  history: {
    push: (string) => void,
  },
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
  }

  getClassName() {
    const classNames = ['navigation'];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    if (this.props.fetching) {
      classNames.push('navigation--fetching');
    }

    return classNames.join(' ');
  }

  changeLocation(filter: string): void {
    let newLocation: string = '/';
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

  tabsChangeHandler(event: SyntheticEvent<any>, filter: string): void {
    this.changeLocation(filter);
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Tabs
          value={getFilterFromLocation(this.props.location)}
          onChange={this.tabsChangeHandler}
        >
          <Tabs.Tab id="default">All</Tabs.Tab>
          <Tabs.Tab id="active">Active</Tabs.Tab>
          <Tabs.Tab id="completed">Completed</Tabs.Tab>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(Navigation);
