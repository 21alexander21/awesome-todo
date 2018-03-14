// @flow
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../../components/Header';
import List from '../../components/List';
import Navigation from '../../components/Navigation';
import { makeId, asyncCreateTodo } from '../../utils';
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

const fakeFetch = () => new Promise(resolve => setTimeout(() => {
  resolve(fakeData);
}, 1500));

type AppState = {
  todos: Array<Todo>,
  fetching: boolean,
};

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    (this: any).createTodo = this.createTodo.bind(this);
    (this: any).changeTodoName = this.changeTodoName.bind(this);
    (this: any).toggleStatus = this.toggleStatus.bind(this);
    (this: any).removeTodo = this.removeTodo.bind(this);
    (this: any).renderTodosList = this.renderTodosList.bind(this);

    this.state = {
      todos: [],
      fetching: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({
      fetching: true,
    }, () => {
      fakeFetch().then((result) => {
        this.setState({
          fetching: false,
          todos: result,
        });
      });
    });
  }

  createTodo(name: string): void {
    this.setState({
      fetching: true,
    }, () => {
      asyncCreateTodo(name).then((resultTodo) => {
        this.setState(prevState => ({
          todos: [...prevState.todos, resultTodo],
          fetching: false,
        }));
      }).catch(() => {
        this.setState({
          fetching: false,
        });
      });
    });
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
        fetching={this.state.fetching}
      />
    );
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Header className="app__header" createTodo={this.createTodo} />
          <Navigation className="app__navigation" fetching={this.state.fetching} />
          <Switch>
            <Route exact path="/" render={this.renderTodosList} />
            <Route exact path="/:filter" render={this.renderTodosList} />
          </Switch>
        </div>
      </Router>
    );
  }
}
