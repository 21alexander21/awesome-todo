import React from 'react';
import PropTypes from 'prop-types';
import Group from '@skbkontur/react-ui/Group';
import Input from '@skbkontur/react-ui/Input';
import Button from '@skbkontur/react-ui/Button';
import './assets/styles/styles.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.fieldName = 'newTodoName';

    this.state = {
      newTodoName: props.defaultNewTodoName,
    };
  }

  submitHandler(event) {
    event.preventDefault();
    const { newTodoName } = this.state;
    if (typeof this.props.createTodo === 'function') {
      this.setState(
        {
          newTodoName: this.props.defaultNewTodoName,
        },
        () => this.props.createTodo(newTodoName),
      );
    }
  }

  changeNewTodoName(name) {
    this.setState({
      newTodoName: name,
    });
  }

  changeHandler(event) {
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

Header.propTypes = {
  className: PropTypes.string,
  defaultNewTodoName: PropTypes.string,
  createTodo: PropTypes.func.isRequired,
};

Header.defaultProps = {
  className: null,
  defaultNewTodoName: '',
};
