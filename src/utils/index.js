export const makeId = (length = 9) => `_${Math.random().toString(36).substr(2, length)}`;

const isValidTodoName = (name) => {
  if (name.replace(/\s/g, '').length) {
    return true;
  }

  return false;
};

const todoHasRequiredField = (todo, requiredField) => requiredField.every(fieldName =>
  Object.prototype.hasOwnProperty.call(todo, fieldName));

export const isValidTodo = (todo) => {
  if (!todo || typeof todo !== 'object') {
    return false;
  }

  if (!todoHasRequiredField(todo, ['name', 'id'])) {
    return false;
  }

  return isValidTodoName(todo.name);
};

