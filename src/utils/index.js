// @flow
import type { Todo } from './types';

export const makeId = (length: number = 9) =>
  `_${Math.random()
    .toString(36)
    .substr(2, length)}`;

const isValidTodoName = (name: string): boolean => {
  if (name.replace(/\s/g, '').length) {
    return true;
  }

  return false;
};

const todoHasRequiredField = (todo, requiredField) =>
  requiredField.every(fieldName => Object.prototype.hasOwnProperty.call(todo, fieldName));

export const isValidTodo = (todo: Todo) => {
  if (!todo || typeof todo !== 'object') {
    return false;
  }

  if (!todoHasRequiredField(todo, ['name'])) {
    return false;
  }

  return isValidTodoName(todo.name);
};

export const asyncCreateTodo = (name: string): Promise<any> => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (isValidTodoName(name)) {
      const todo = {
        name,
        id: makeId(),
        done: false,
      };

      resolve(todo);
    }

    reject(new Error('Не валидное имя тудушки'));
  }, 1000);
});
