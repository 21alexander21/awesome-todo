// @flow
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../../components/Header';
import List from '../../components/List';
import Navigation from '../../components/Navigation';
import { makeId, isValidTodo } from '../../utils';
import type { Todo } from '../../utils/types';
import './assets/styles/styles.css';

const fakeData = [
  {
    id: makeId(),
    name: 'test1',
    done: false,
  },
  {
    id: makeId(),
    name: 'test2',
    done: false,
  },
  {
    id: makeId(),
    name: 'test3',
    done: true,
  },
];

export default class App extends React.Component<{}, { todos: Array<Todo> }> {
  constructor(props: {}) {
    super(props);

    (this: any).createTodo = this.createTodo.bind(this);
    (this: any).changeTodoName = this.changeTodoName.bind(this);
    (this: any).toggleStatus = this.toggleStatus.bind(this);
    (this: any).removeTodo = this.removeTodo.bind(this);
    (this: any).renderTodosList = this.renderTodosList.bind(this);

    this.state = {
      todos: fakeData,
    };
  }

  createTodo(name: string): void {
    const newTodo: Todo = {
      name,
      id: makeId(),
      done: false,
    };

    if (isValidTodo(newTodo)) {
      this.setState(prevState => ({
        todos: [...prevState.todos, newTodo],
      }));
    }
  }

  changeTodoName(id: string, newName: string) {
    this.setState(prevState => ({
      todos: [
        ...prevState.todos.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              name: newName,
            };
          }
          return item;
        }),
      ],
    }));
  }

  toggleStatus(id: string) {
    this.setState(prevState => ({
      todos: [
        ...prevState.todos.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              done: !item.done,
            };
          }
          return item;
        }),
      ],
    }));
  }

  removeTodo(id: string) {
    this.setState(prevState => ({
      todos: [...prevState.todos.filter(item => item.id !== id)],
    }));
  }

  renderTodosList() {
    return (
      <List
        className="app__list"
        todos={this.state.todos}
        operations={{
          removeTodo: this.removeTodo,
          changeTodoName: this.changeTodoName,
          toggleStatus: this.toggleStatus,
        }}
      />
    );
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Header className="app__header" createTodo={this.createTodo} />
          <Navigation className="app__navigation" />
          <Switch>
            <Route exact path="/" render={this.renderTodosList} />
            <Route exact path="/:filter" render={this.renderTodosList} />
          </Switch>
        </div>
      </Router>
    );
  }
}
