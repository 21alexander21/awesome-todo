import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import TodoItem from '../TodoItem';
import './assets/styles/styles.css';

const getFilteredTodos = (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter(item => !item.done);

    case 'completed':
      return todos.filter(item => item.done);

    default:
      return todos;
  }
};

const List = (props) => {
  const { filter = null } = props.match.params;
  const todos = getFilteredTodos(props.todos, filter);

  return (
    <ul className={`list ${props.className ? props.className : props.className}`}>
      {todos.map(item => (
        <li className="list__item" key={item.id}>
          <TodoItem todoData={item} operations={props.operations} />
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {
  className: PropTypes.string,
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  operations: PropTypes.objectOf(PropTypes.func).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      filter: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

List.defaultProps = {
  className: null,
};

export default withRouter(List);
