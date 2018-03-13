export const makeId = (length = 9) => `_${Math.random().toString(36).substr(2, length)}`;

const isValidTodoName = (name) => {
  if (name.replace(/\s/g, '').length) {
    return true;
  }

  return false;
};

export const isValidTodo = todo => isValidTodoName(todo.name);
