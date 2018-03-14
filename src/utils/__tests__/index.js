import { isValidTodo } from '../';

describe('валидация тудушек', () => {
  it('валидация без тудушки не пройдет', () => {
    expect(isValidTodo(null)).toBeFalsy();
    expect(isValidTodo()).toBeFalsy();
  });

  it('тудушка без имени не пройдет', () => {
    const badTodo = {
      id: '12s',
    };

    expect(isValidTodo(badTodo)).toBeFalsy();
  });

  it('Правильная тудушка вернет true', () => {
    const greatTodo = {
      id: '12s',
      name: 'Сделай это',
    };

    expect(isValidTodo(greatTodo)).toBeTruthy();
  });
});
