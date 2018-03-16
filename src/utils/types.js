// @flow
export type TodoId = string;
export type TodoName = string;
export type TodoDone = boolean;

export type Todo = {
  id: TodoId,
  name: TodoName,
  done: TodoDone,
};

export type Operations = {
  removeTodo: (id: string) => void,
  changeTodoName: (id: string, name: string) => void,
  toggleStatus: (id: string) => void,
};
