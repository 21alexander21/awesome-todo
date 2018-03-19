// @flow
export type TodoId = string;
export type TodoName = string;
export type TodoDone = boolean;

export type Todo = {
  id: TodoId,
  name: TodoName,
  done: TodoDone
};

export type Operations = {
  removeTodo: (id: string) => Promise<void>,
  changeTodoName: (id: string, name: string) => Promise<void>,
  toggleStatus: (id: string) => Promise<void>
};
