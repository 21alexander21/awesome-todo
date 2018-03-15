// @flow
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from '../../components/Header';
import List from '../../components/List';
import Navigation from '../../components/Navigation';
import { FakeApi } from '../../utils';
import type { Todo } from '../../utils/types';
import './assets/styles/styles.css';

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

  // TODO: передавать api через пропсы
  api = new FakeApi();

  loadData() {
    this.setState(
      {
        fetching: true,
      },
      () => {
        this.api.getAllTodos().then(
          (result) => {
            this.setState({
              fetching: false,
              todos: result,
            });
          },
          () => {
            /* TODO: обработать ошибку */
          },
        );
      },
    );
  }

  createTodo(name: string): void {
    this.setState(
      {
        fetching: true,
      },
      // TODO: вытащить из callback
      () => {
        this.api
          .createTodo(name)
          .then((resultTodo) => {
            this.setState(prevState => ({
              todos: [...prevState.todos, resultTodo],
              fetching: false,
            }));
          })
          .catch(() => {
            // TODO: хорошо бы ошибку показать
            this.setState({
              fetching: false,
            });
          });
      },
    );
  }

  changeTodoName(id: string, newName: string) {
    this.setState(prevState => ({
      todos: prevState.todos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: newName,
          };
        }
        return item;
      }),
    }));
  }

  // TODO: добаивть в FakeApi переключение и удаление
  toggleStatus(id: string) {
    this.setState(prevState => ({
      todos: [
        // TODO: убрать спред перед .map
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
      // TODO: убрать спред перед .filter
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
          {/* TODO: сделать отдельные компоненты для оберток вместо передачи className */}
          <Header className="app__header" createTodo={this.createTodo} />
          <Navigation className="app__navigation" fetching={this.state.fetching} />
          <Route exact path="/(:filter)?" render={this.renderTodosList} />
        </div>
      </Router>
    );
  }
}
