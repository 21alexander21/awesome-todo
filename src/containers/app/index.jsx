// @flow
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from '../../components/Header';
import List from '../../components/List';
import Navigation from '../../components/Navigation';
import { FakeApi } from '../../utils';
import type { Todo, TodoId, TodoName } from '../../utils/types';
import './assets/styles/styles.css';

type AppState = {
  todos: Array<Todo>,
  fetching: boolean,
  creatingError: ?Error,
  loadingError: ?Error,
  todoError: ?{
    id: TodoId,
    error: string,
  },
  todoIdFetching: ?TodoId,
};

export default class App extends React.Component<{api: FakeApi}, AppState> {
  state = {
    todos: [],
    fetching: false,
    creatingError: null,
    loadingError: null,
    todoError: null,
    todoIdFetching: null,
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

  changeTodoName = async (id: TodoId, name: TodoName): Promise<*> => {
    this.setState({
      todoIdFetching: id,
      todoError: null,
    });

    try {
      const result = await this.api.renameTodo(id, name);
      this.setState(prevState => ({
        todos: prevState.todos.map((item) => {
          if (item.id === result.id) {
            return {
              ...item,
              name: result.name,
            };
          }
          return item;
        }),
      }));
    } catch (error) {
      this.setState({
        todoError: {
          id,
          error: error.message,
        },
      });
    } finally {
      this.setState({
        todoIdFetching: null,
      });
    }
  };

  toggleStatus = async (id: TodoId): Promise<*> => {
    this.setState({
      todoIdFetching: id,
    });

    try {
      const result = await this.api.toggleTodo(id);
      this.setState(prevState => ({
        todos: prevState.todos.map((item) => {
          if (item.id === result) {
            return {
              ...item,
              done: !item.done,
            };
          }
          return item;
        }),
      }));
    } catch (error) {
      this.setState({
        todoError: {
          id,
          error: error.message,
        },
      });
    } finally {
      this.setState({
        todoIdFetching: null,
      });
    }
  };

  removeTodo = async (id: string): Promise<*> => {
    this.setState({ fetching: true });
    try {
      await this.api.removeTodo(id);
      this.setState(prevState => ({
        todos: prevState.todos.filter(item => item.id !== id),
      }));
    } catch (error) {
      this.setState({
        loadingError: error,
      });
    } finally {
      this.setState({ fetching: false });
    }
  };

  renderTodosList = () => (
    <div className="app__list">
      <List
        todos={this.state.todos}
        operations={{
          removeTodo: this.removeTodo,
          changeTodoName: this.changeTodoName,
          toggleStatus: this.toggleStatus,
        }}
        fetching={this.state.fetching}
        todoError={this.state.todoError}
        todoIdFetching={this.state.todoIdFetching}
      />
    </div>
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
