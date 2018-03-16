// @flow
import * as React from 'react';
import Group from '@skbkontur/react-ui/Group';
import Input from '@skbkontur/react-ui/Input';
import Button from '@skbkontur/react-ui/Button';
import './assets/styles/styles.css';

type HeaderProps = {
  createTodo: Function,
  defaultNewTodoName?: string,
};

type HeaderState = {
  newTodoName: ?string,
};

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps = {
    defaultNewTodoName: '',
  };

  state = {
    newTodoName: this.props.defaultNewTodoName || '',
  };

  handleSubmit = (event: ?SyntheticKeyboardEvent<HTMLButtonElement>): void => {
    if (event) {
      event.preventDefault();
    }

    const { newTodoName } = this.state;
    if (newTodoName) {
      this.setState({
        newTodoName: this.props.defaultNewTodoName,
      });

      this.props.createTodo(newTodoName);
    }
  };

  changeNewTodoName(name: string) {
    this.setState({
      newTodoName: name,
    });
  }

  handleChange = (event: { target: { id: string, value: string } }): void => {
    this.changeNewTodoName(event.target.value);
  };

  render() {
    return (
      <header className="header">
        <form
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          className="header__editor"
        >
          <Group width="100%">
            <Input
              mainInGroup
              value={this.state.newTodoName}
              onChange={this.handleChange}
              placeholder="What to do?"
              id="newTodoName"
              size="large"
              className="header__field"
            />
            <Button icon="add" onClick={this.handleSubmit} type="submit" size="large">
              Add
            </Button>
          </Group>
        </form>
      </header>
    );
  }
}
