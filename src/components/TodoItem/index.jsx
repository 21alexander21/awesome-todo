import React from 'react';
import PropTypes from 'prop-types';
import Kebab from '@skbkontur/react-ui/Kebab';
import MenuItem from '@skbkontur/react-ui/MenuItem';
import Input from '@skbkontur/react-ui/Input';
import './assets/styles/styles.css';

export default class TodoItem extends React.Component {
  static isClickOnKebab(nativeClickEvent) {
    return nativeClickEvent.path.some(item => item.dataset && item.dataset.kebab);
  }

  constructor(props) {
    super(props);

    this.makeEditable = this.makeEditable.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitName = this.submitName.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.todoClickHandler = this.todoClickHandler.bind(this);

    this.state = {
      onEditing: false,
      editableName: props.todoData ? props.todoData.name : '',
    };
  }

  makeEditable() {
    this.setState(
      {
        onEditing: true,
      },
      () => {
        this.field.focus();
        this.field.setSelectionRange(0, this.state.editableName.length);
      },
    );
  }

  changeHandler(event) {
    const newName = event.target.value;

    this.setState({
      editableName: newName,
    });
  }

  submitName() {
    this.setState(
      {
        onEditing: false,
      },
      () => {
        this.props.operations.changeTodoName(this.props.todoData.id, this.state.editableName);
      },
    );
  }

  cancel() {
    this.setState({
      onEditing: false,
      editableName: this.props.todoData.name,
    });
  }

  keyDownHandler(event) {
    if (event.keyCode === 27 || event.key === 'Escape') {
      this.cancel();
    }

    if (event.keyCode === 13 || event.key === 'Enter') {
      this.submitName();
    }
  }

  toggleStatus() {
    this.props.operations.toggleStatus(this.props.todoData.id);
  }

  removeItem() {
    this.props.operations.removeTodo(this.props.todoData.id);
  }

  todoClickHandler(event) {
    if (!this.isClickOnKebab(event.nativeEvent)) {
      this.toggleStatus();
    }
  }

  render() {
    if (!this.props.todoData) {
      return null;
    }
    return (
      <div
        className="todo-item"
        onDoubleClick={this.makeEditable}
        onClick={this.todoClickHandler}
        onKeyPress={() => {}}
        role="button"
        tabIndex="-1"
      >
        <div className="todo-item__inner">
          {this.state.onEditing ? (
            <Input
              value={this.state.editableName}
              onChange={this.changeHandler}
              onBlur={this.submitName}
              onKeyDown={this.keyDownHandler}
              ref={(component) => {
                this.field = component;
              }}
            />
          ) : (
            <span
              className={`todo-item__name ${
                this.props.todoData.done ? 'todo-item__name--done' : ''
              }`}
            >
              {this.props.todoData.name}
            </span>
          )}
          <span data-kebab>
            <Kebab>
              <MenuItem icon="edit" onClick={this.makeEditable}>
                Edit
              </MenuItem>
              <MenuItem icon="ok" onClick={this.toggleStatus}>
                Toggle
              </MenuItem>
              <MenuItem icon="trash" onClick={this.removeItem}>
                Remove
              </MenuItem>
            </Kebab>
          </span>
        </div>
      </div>
    );
  }
}

TodoItem.propTypes = {
  todoData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  operations: PropTypes.objectOf(PropTypes.func).isRequired,
};
