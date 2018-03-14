// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import Spinner from '@skbkontur/react-ui/Spinner';
import TodoItem from '../TodoItem';
import type { Todo } from '../../utils/types';
import './assets/styles/styles.css';

type ListProps = {
  className?: string,
  todos: Array<Todo>,
  match: {
    params: {
      filter?: string,
    }
  },
  operations: { [string]: Function },
  fetching: boolean,
};

const getFilteredTodos = (todos: Array<Todo>, filter: ?string) => {
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
    <ul className={`list ${props.className ? props.className : ''}`}>
      {props.fetching &&
        <div className="list__spinner-container">
          <Spinner
            caption="Спиннер крутиться - тудушки грузятся..."
          />
        </div>
      }
      {todos.map(item => (
        <li className="list__item" key={item.id}>
          <TodoItem todoData={item} operations={props.operations} />
        </li>
      ))}
    </ul>
  );
};

List.defaultProps = {
  className: null,
};

export default withRouter(List);
