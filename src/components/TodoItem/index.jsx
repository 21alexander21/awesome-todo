// @flow
import * as React from 'react';
import Kebab from '@skbkontur/react-ui/Kebab';
import MenuItem from '@skbkontur/react-ui/MenuItem';
import Input from '@skbkontur/react-ui/Input';
import Spinner from '@skbkontur/react-ui/Spinner';
import type { Todo, Operations } from '../../utils/types';
import './assets/styles/styles.css';

type TodoItemProps = {
  todoData: Todo,
  operations: Operations,
  fetching: boolean,
  error: ?string,
};

type TodoItemState = {
  onEditing: boolean,
  editableName: $PropertyType<Todo, 'name'>,
  error: ?string,
};

export default class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
  state = {
    onEditing: false,
    editableName: this.props.todoData ? this.props.todoData.name : '',
    error: this.props.error,
  };

  componentWillReceiveProps(nextProps: TodoItemProps) {
    this.setState({
      error: nextProps.error,
      onEditing: !!nextProps.error,
    });
  }

  field: ?Input;

  makeEditable = (): void => {
    if (this.props.fetching) {
      return;
    }

    this.setState(
      {
        onEditing: true,
      },
      () => {
        const { field } = this;
        if (field) {
          field.focus();
          field.setSelectionRange(0, this.state.editableName.length);
        }
      },
    );
  }

  changeHandler = (_: *, value: string): void => {
    const newName: string = value;

    this.setState({
      editableName: newName,
      error: null,
    });
  }

  submitName = (): void => {
    this.setState({
      onEditing: false,
    });

    this.props.operations.changeTodoName(this.props.todoData.id, this.state.editableName);
  }

  cancel = (): void => {
    this.setState({
      onEditing: false,
      editableName: this.props.todoData.name,
    });
  }

  keyDownHandler = (event: SyntheticKeyboardEvent<Input>): void => {
    if (event.keyCode === 27 || event.key === 'Escape') {
      this.cancel();
    }

    if (event.keyCode === 13 || event.key === 'Enter') {
      this.submitName();
    }
  }

  toggleStatus = (): void => {
    if (this.props.fetching) {
      return;
    }
    this.props.operations.toggleStatus(this.props.todoData.id);
  }

  removeItem = (): void => {
    if (this.props.fetching) {
      return;
    }
    this.props.operations.removeTodo(this.props.todoData.id);
  }

  todoClickHandler = (): void => {
    this.toggleStatus();
  }

  render() {
    if (!this.props.todoData) {
      return null;
    }
    return (
      <div
        className={`todo-item ${this.state.error ? 'todo-item--error' : ''}`}
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
              error={!!this.state.error}
              autoFocus
            />
          ) : (
            <span
              className={`todo-item__name ${
                this.props.todoData.done ? 'todo-item__name--done' : ''
              }`}
            >
              {this.props.fetching &&
                <span className="todo-item__spinner">
                  <Spinner type="mini" caption="" />
                </span>
              }
              {this.props.todoData.name}
            </span>
          )}
          <span
            onClick={(event: Event): void => event.stopPropagation()}
            onDoubleClick={(event: Event): void => event.stopPropagation()}
            onKeyPress={() => {}}
            role="button"
            tabIndex="-1"
          >
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
