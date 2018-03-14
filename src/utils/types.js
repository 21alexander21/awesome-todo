// @flow
export type Todo = {
  id: string,
  name: string,
  done: boolean,
};

export type Operations = {
  removeTodo: (id: string) => void,
  changeTodoName: (id: string, name: string) => void,
  toggleStatus: (id: string) => void,
};
