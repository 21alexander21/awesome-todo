// @flow
import * as React from 'react';
import Kebab from '@skbkontur/react-ui/Kebab';
import MenuItem from '@skbkontur/react-ui/MenuItem';
import Input from '@skbkontur/react-ui/Input';
import type { Todo, Operations } from '../../utils/types';
import './assets/styles/styles.css';

type TodoItemProps = {
  todoData: Todo,
  operations: Operations,
};

type TodoItemState = {
  onEditing: boolean,
  editableName: $PropertyType<Todo, 'name'>,
};

export default class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
  constructor(props: TodoItemProps) {
    super(props);

    (this: any).makeEditable = this.makeEditable.bind(this);
    (this: any).changeHandler = this.changeHandler.bind(this);
    (this: any).submitName = this.submitName.bind(this);
    (this: any).keyDownHandler = this.keyDownHandler.bind(this);
    (this: any).toggleStatus = this.toggleStatus.bind(this);
    (this: any).removeItem = this.removeItem.bind(this);
    (this: any).todoClickHandler = this.todoClickHandler.bind(this);

    this.state = {
      onEditing: false,
      editableName: props.todoData ? props.todoData.name : '',
    };
  }

  field: ?React.Element<Input>

  makeEditable() {
    this.setState(
      {
        onEditing: true,
      },
      () => {
        if (this.field instanceof Input && typeof this.field.setSelectionRange === 'function') {
          this.field.focus();
          this.field.setSelectionRange(0, this.state.editableName.length);
        }
      },
    );
  }

  changeHandler(event: SyntheticKeyboardEvent<HTMLInputElement>): void {
    const newName: string = event.target.value;

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

  keyDownHandler(event: SyntheticKeyboardEvent<Input>) {
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

  todoClickHandler() {
    this.toggleStatus();
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
