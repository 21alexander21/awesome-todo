import { isValidTodo, FakeApi } from '../';

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

describe('Фейковое api', () => {
  it('Возвращается правильное количество тудушек', async () => {
    const fakeApi = new FakeApi();
    const initialTodoCount = FakeApi.initialData.length;
    const returnedTodos = await fakeApi.getAllTodos();
    expect(returnedTodos.length).toEqual(initialTodoCount);
  });

  it('При создании возвращается тудушка c переданным именем', async () => {
    const fakeApi = new FakeApi();
    const todoName = 'Имя для тудушки';
    const createdTodo = await fakeApi.createTodo(todoName);

    expect(createdTodo.name).toBe(todoName);
  });

  describe('Создание тудушек:', () => {
    const fakeApi = new FakeApi();
    describe('Эксепшен при создании тудушки с невалидным именем:', () => {
      const badNamesTestcase = [
        null,
        undefined,
        '',
        ' ',
        '     ',
      ];
  
      badNamesTestcase.forEach((name) => {
        it(`Имя - "${name}"`, async () => {
          expect.assertions(1);
          try {
            await fakeApi.createTodo(name);
          } catch (error) {
            expect(error).toBeInstanceOf(Error);
          }
        });
      });
    });

    describe('Тудушки с правильным именем создаются и возвращаются:', () => {
      const goodNamesTestcase = [
        'Сделай это',
        'Сделай то',
        '   и это',
        '              1',
      ];

      goodNamesTestcase.forEach((name) => {
        it(`Имя - "${name}"`, async () => {
          expect.assertions(1);
          const createdTodo = await fakeApi.createTodo(name);
          expect(createdTodo.name).toBe(name);
        });
      });
    });
  });
});
