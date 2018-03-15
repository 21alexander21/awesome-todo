// @flow
import * as React from 'react';
import Group from '@skbkontur/react-ui/Group';
import Input from '@skbkontur/react-ui/Input';
import Button from '@skbkontur/react-ui/Button';
import './assets/styles/styles.css';

type HeaderProps = {
  createTodo: (name: string) => void,
  className: string,
  defaultNewTodoName?: string,
};

type HeaderState = {
  newTodoName: ?string,
};

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps = {
    className: null,
    defaultNewTodoName: '',
  };

  constructor(props: HeaderProps) {
    super(props);

    (this: any).changeHandler = this.changeHandler.bind(this);
    (this: any).submitHandler = this.submitHandler.bind(this);

    this.state = {
      newTodoName: props.defaultNewTodoName || '',
    };
  }

  fieldName: string = 'newTodoName';

  submitHandler(event: ?SyntheticKeyboardEvent<HTMLButtonElement>) {
    if (event) {
      event.preventDefault();
    }

    const { newTodoName } = this.state;
    if (typeof this.props.createTodo === 'function' && !!newTodoName) {
      this.setState(
        {
          newTodoName: this.props.defaultNewTodoName,
        },
        () => this.props.createTodo(newTodoName),
      );
    }
  }

  changeNewTodoName(name: string) {
    this.setState({
      newTodoName: name,
    });
  }

  changeHandler(event: { target: { id: string, value: string } }) {
    // TODO: убрать эту проверку
    if (event.target.id === this.fieldName) {
      this.changeNewTodoName(event.target.value);
    }
  }

  render() {
    return (
      <header className={`header ${this.props.className ? this.props.className : ''}`}>
        <form
          onChange={this.changeHandler}
          onSubmit={this.submitHandler}
          className="header__editor"
        >
          <Group width="100%">
            <Input
              mainInGroup
              value={this.state.newTodoName}
              onChange={this.changeHandler}
              placeholder="What to do?"
              id={this.fieldName}
              size="large"
              className="header__field"
            />
            <Button icon="add" onClick={this.submitHandler} type="submit" size="large">
              Add
            </Button>
          </Group>
        </form>
      </header>
    );
  }
}
