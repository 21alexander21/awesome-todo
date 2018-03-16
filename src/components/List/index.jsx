// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import Spinner from '@skbkontur/react-ui/Spinner';
import TodoItem from '../TodoItem';
import type { Todo, TodoId } from '../../utils/types';
import './assets/styles/styles.css';

type ListProps = {
  todos: Array<Todo>,
  match: {
    params: {
      filter?: string,
    },
  },
  operations: { [string]: Function },
  fetching: boolean,
  todoIdFetching?: TodoId,
  todoError: ?{
    id: TodoId,
    error: string,
  },
};

const getFilteredTodos = (todos: Array<Todo>, filter: ?string): Array<Todo> => {
  switch (filter) {
    case 'active':
      return todos.filter(item => !item.done);

    case 'completed':
      return todos.filter(item => item.done);

    default:
      return todos;
  }
};

const List = (props: ListProps) => {
  const { filter = null } = props.match.params;
  const todos = getFilteredTodos(props.todos, filter);

  return (
    <ul className="list">
      {props.fetching && (
        <div className="list__spinner-container">
          <Spinner caption="Спиннер крутиться - тудушки грузятся..." />
        </div>
      )}
      {todos.map(item => (
        <li className="list__item" key={item.id}>
          <TodoItem
            fetching={!!props.todoIdFetching && item.id === props.todoIdFetching}
            todoData={item}
            operations={props.operations}
            error={!!props.todoError && props.todoError.id === item.id ? props.todoError.error : null}
          />
        </li>
      ))}
    </ul>
  );
};

List.defaultProps = {
  todoIdFetching: null,
};

export default withRouter(List);
