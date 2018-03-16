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
  creatingError: ?Error,
  loadingError: ?Error,
};

export default class App extends React.Component<{api: FakeApi}, AppState> {
  state = {
    todos: [],
    fetching: false,
    creatingError: null,
    loadingError: null,
  };

  componentDidMount() {
    this.loadData();
  }

  api = this.props.api;

  loadData = async (): Promise<*> => {
    this.setState({ fetching: true });

    try {
      const result = await this.api.getAllTodos();
      this.setState({
        todos: result,
      });
    } catch (error) {
      this.setState({
        loadingError: error,
      });
    } finally {
      this.setState({ fetching: false });
    }
  }

  createTodo = async (name: string): Promise<*> => {
    this.setState({
      fetching: true,
    });

    try {
      const result: Todo = await this.api.createTodo(name);
      this.setState(prevState => ({
        todos: [...prevState.todos, result],
      }));
    } catch (error) {
      this.setState({
        creatingError: error,
      });
    } finally {
      this.setState({ fetching: false });
    }
  };

  changeTodoName = (id: string, newName: string): void => {
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
  };

  // TODO: добаивть в FakeApi переключение и удаление
  toggleStatus = (id: string): void => {
    this.setState(prevState => ({
      todos: prevState.todos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            done: !item.done,
          };
        }
        return item;
      }),
    }));
  };

  removeTodo = (id: string): void => {
    this.setState(prevState => ({
      todos: prevState.todos.filter(item => item.id !== id),
    }));
  };

  renderTodosList = () => (
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
  )

  render() {
    return (
      <Router>
        <div className="app">
          <div className="app__header">
            <Header createTodo={this.createTodo} creatingError={this.state.creatingError} />
          </div>
          <div className="app__navigation">
            <Navigation fetching={this.state.fetching} />
          </div>
          <Route exact path="/:filter?" render={this.renderTodosList} />
        </div>
      </Router>
    );
  }
}
