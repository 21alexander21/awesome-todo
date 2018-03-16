import React from 'react';
import {
  shallow,
  mount,
} from 'enzyme';
import App from '../';
import { FakeApi } from '../../../utils';

const renderComponent = () => shallow(React.createElement(App, { api: new FakeApi() }));
const fullRenderComponent = () => mount(React.createElement(App, { api: new FakeApi() }));

describe('Контэйнер <App />', () => {
  it('Рендер', () => {
    expect(renderComponent()).toHaveLength(1);
  });

  it('Список тудушек рэндерится', () => {
    expect(fullRenderComponent().find('List')).toHaveLength(1);
  });

  describe('Получение данных', () => {
    it('Получение списка тудушек', async () => {
      const component = renderComponent();
      const expectedDataLength = FakeApi.initialData.length;

      expect.assertions(2);
      expect(component.state('todos')).toHaveLength(0);
      await component.instance().loadData();
      expect(component.state('todos')).toHaveLength(expectedDataLength);
    });

    it('Загрузка начинается на didMount', () => {
      const component = renderComponent();
      component.instance().loadData = jest.fn();

      expect(component.instance().loadData).toHaveBeenCalledTimes(0);
      component.instance().componentDidMount();
      expect(component.instance().loadData).toHaveBeenCalledTimes(1);
    });

    // it('флажок fetching устанавливается в стэйт на время загрузки и снимается после', async () => {
    //   const component = renderComponent();

    //   expect(component.state('fetching')).toBeFalsy();
    //   await component.instance().loadData();
    //   expect(component.state('fetching')).toBeFalsy();
    // });

    it('В случае ошибки на сервере в стейт пишется текст ошибки', async () => {
      const component = renderComponent();
      const mockApiMethod = jest.fn().mockImplementation(() => Promise.reject(new Error('Ошибка загрузки')));
      component.instance().api.getAllTodos = mockApiMethod;

      expect(component.state('loadingError')).toBeNull();
      await component.instance().loadData();
      expect(component.state('loadingError')).toBe('Ошибка загрузки');
    });
  });

  describe('Добавление данных', () => {
    it('Добавление тудушки увеличивает кол-во тудушек в стэйте на 1', async () => {
      const component = renderComponent();

      expect(component.state('todos')).toHaveLength(0);
      await component.instance().createTodo('Имя');
      expect(component.state('todos')).toHaveLength(1);
    });

    it('Добавление тудушки с невалидным именем добавит ошибку creatingError в стэйт', async () => {
      const component = renderComponent();
      expect(component.state('creatingError')).toBeNull();
      await component.instance().createTodo('     ');
      expect(component.state('creatingError')).toBeInstanceOf(Error);
    });
  });

  describe('Переименование', () => {
    it('После переименования тудушки с айди "_000" ее имя должно измениться', async () => {
      const component = renderComponent();
      const testTodo = {
        id: '_000',
        name: 'Old name',
        done: false,
      };
      const newName = 'New name';

      component.setState({
        todos: [
          testTodo,
        ],
      });

      await component.instance().changeTodoName(testTodo.id, newName);
      expect(component.state('todos')).toContainEqual({ ...testTodo, name: newName });
      expect(component.state('todos')).not.toContainEqual(testTodo);
    });

    it('Переименование невалидным именем, не изменит тудушку', async () => {
      const component = renderComponent();
      const testTodo = {
        id: '_000',
        name: 'Old name',
        done: false,
      };
      const newName = '';

      component.setState({
        todos: [
          testTodo,
        ],
      });

      await component.instance().changeTodoName(testTodo.id, newName);
      expect(component.state('todos')).toContainEqual(testTodo);
      expect(component.state('todos')).not.toContainEqual({ ...testTodo, name: newName });
    });

    it('Переименование одной тудушки не затронет другие', async () => {
      const component = renderComponent();
      const testTodos = [
        {
          id: '_001',
          name: 'Old name1',
          done: false,
        },
        {
          id: '_002',
          name: 'Old name2',
          done: false,
        },
        {
          id: '_003',
          name: 'Old name3',
          done: false,
        },
      ];

      component.setState({ todos: testTodos });
      await component.instance().changeTodoName('_002', 'New name2');
      expect(component.state('todos')).toEqual([
        {
          id: '_001',
          name: 'Old name1',
          done: false,
        },
        {
          id: '_002',
          name: 'New name2',
          done: false,
        },
        {
          id: '_003',
          name: 'Old name3',
          done: false,
        },
      ]);
    });
  });

  describe('Переключение статуса тудушки', () => {
    it('Статус переключается на противоположный', async () => {
      const component = renderComponent();
      const testTodo = {
        id: '_000',
        name: 'Old name',
        done: false,
      };

      component.setState({
        todos: [
          testTodo,
        ],
      });

      await component.instance().toggleStatus(testTodo.id);
      expect(component.state('todos')).toEqual([{ ...testTodo, done: !testTodo.done }]);

      await component.instance().toggleStatus(testTodo.id);
      expect(component.state('todos')).toEqual([{ ...testTodo, done: testTodo.done }]);
    });

    it('Переключение статуса у одной тудушки не затронет другие', async () => {
      const component = renderComponent();
      const testTodos = [
        {
          id: '_001',
          name: 'Old name1',
          done: false,
        },
        {
          id: '_002',
          name: 'Old name2',
          done: false,
        },
        {
          id: '_003',
          name: 'Old name3',
          done: false,
        },
      ];

      component.setState({ todos: testTodos });
      await component.instance().toggleStatus('_002');
      expect(component.state('todos')).toEqual([
        {
          id: '_001',
          name: 'Old name1',
          done: false,
        },
        {
          id: '_002',
          name: 'Old name2',
          done: true,
        },
        {
          id: '_003',
          name: 'Old name3',
          done: false,
        },
      ]);
    });

    it('В случае ошибки на сервере, в стэйт должна записаться ошибка и идентификатор тудушки, а тудушка остаться неизменной', async () => {
      const component = renderComponent();
      const testTodo = {
        id: '_0001',
        name: 'Todo',
        done: false,
      };
      const mockApiMethod = jest.fn().mockImplementation(() => Promise.reject(new Error('Ошибка')));
      component.instance().api.toggleTodo = mockApiMethod;
      component.setState({ todos: [testTodo] });

      expect(component.state('todoError')).toBeNull();
      await component.instance().toggleStatus(testTodo.id);
      expect(component.state('todoError')).toEqual({
        id: testTodo.id,
        error: 'Ошибка',
      });
      expect(component.state('todos')).toEqual([testTodo]);
    });
  });

  describe('Удаление', () => {
    it('Тудушка должна удалиться', async () => {
      const component = renderComponent();
      component.setState({
        todos: [
          {
            id: '_0001',
            name: 'Todo',
            done: false,
          },
        ],
      });

      await component.instance().removeTodo('_0001');
      expect(component.state('todos')).toHaveLength(0);
    });

    it('Удаление одной тудушки не должно влиять на другие', async () => {
      const component = renderComponent();
      component.setState({
        todos: [
          {
            id: '_0001',
            name: 'Todo1',
            done: false,
          },
          {
            id: '_0002',
            name: 'Todo2',
            done: false,
          },
        ],
      });

      await component.instance().removeTodo('_0001');
      expect(component.state('todos')).toEqual([
        {
          id: '_0002',
          name: 'Todo2',
          done: false,
        },
      ]);
    });

    it('В случае ошибки на сервере, в стэйт должна записаться ошибка loadingError и тудушка остаться не тронутой', async () => {
      const component = renderComponent();
      const mockApiMethod = jest.fn().mockImplementation(() => Promise.reject(new Error('Ошибка при удалении')));
      component.instance().api.removeTodo = mockApiMethod;
      component.setState({
        todos: [
          {
            id: '_0001',
            name: 'Todo',
            done: false,
          },
        ],
      });

      expect(component.state('loadingError')).toBeNull();
      await component.instance().removeTodo('_0001');
      expect(component.state('loadingError')).toEqual('Ошибка при удалении');
      expect(component.state('todos')).toEqual([
        {
          id: '_0001',
          name: 'Todo',
          done: false,
        },
      ]);
    });
  });
});
