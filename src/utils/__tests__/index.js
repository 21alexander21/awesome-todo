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
  const badNamesTestcase = [
    null,
    undefined,
    '',
    ' ',
    '     ',
  ];
  const goodNamesTestcase = [
    'Сделай это',
    'Сделай то',
    '   и это',
    '              1',
  ];

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
      badNamesTestcase.forEach((name) => {
        it(`Имя - "${name}"`, async () => {
          expect.assertions(1);
          await expect(fakeApi.createTodo(name)).rejects.toBeInstanceOf(Error);
        });
      });
    });

    describe('Тудушки с правильным именем создаются и возвращаются:', () => {
      goodNamesTestcase.forEach((name) => {
        it(`Имя - "${name}"`, async () => {
          expect.assertions(1);
          await expect(fakeApi.createTodo(name)).resolves.toMatchObject({
            name,
          });
        });
      });
    });

    describe('Переименование', () => {
      goodNamesTestcase.forEach((name) => {
        it(`Валидное имя - "${name}"`, async () => {
          expect.assertions(1);
          await expect(fakeApi.renameTodo('_aabbccddee', name)).resolves.toEqual({ id: '_aabbccddee', name });
        });
      });

      badNamesTestcase.forEach((name) => {
        it(`Не валидное имя - "${name}"`, async () => {
          expect.assertions(1);
          await expect(fakeApi.renameTodo('_aabbccddee', name)).rejects.toBeInstanceOf(Error);
        });
      });

      test('Без идентификатора вернется ошибка', async () => {
        expect.assertions(1);
        await expect(fakeApi.renameTodo(null, 'Валидное имя')).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
