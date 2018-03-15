import React from 'react';
import { mount, shallow } from 'enzyme';
import Input from '@skbkontur/react-ui/Input';
import TodoItem from '../';

const fullRenderComponent = props => mount(React.createElement(TodoItem, props));
const renderComponent = props => shallow(React.createElement(TodoItem, props));

const normalTodoData = {
  id: '12345abcd',
  name: 'Normal',
  done: false,
};

const normalOperations = {
  changeTodoName: () => {},
  toggleStatus: () => {},
  removeTodo: () => {},
};

describe('Компонент <TodoItem />', () => {
  it('Нормальный рендер', () => {
    renderComponent({
      todoData: normalTodoData,
      operations: normalOperations,
    });
  });

  it('Не крашится без пропсов', () => {
    const wrapper = renderComponent();

    expect(wrapper).toBeEmptyRender();
  });

  it('По клику вызывается переключение состояния с идентификатором', () => {
    const component = fullRenderComponent({
      todoData: normalTodoData,
      operations: {
        ...normalOperations,
        toggleStatus: jest.fn(),
      },
    });

    component.simulate('click');

    expect(component.props().operations.toggleStatus).toBeCalledWith(normalTodoData.id);
  });

  describe('Переименование тудушки', () => {
    it('makeEditable работает', () => {
      const component = renderComponent({
        todoData: normalTodoData,
      });

      expect(component.state('onEditing')).toBeFalsy();
      component.instance().makeEditable();
      expect(component.state('onEditing')).toBeTruthy();
    });

    it('По двойному клику появляется инпут', () => {
      const component = fullRenderComponent({
        todoData: normalTodoData,
        operations: normalOperations,
      });

      expect(component.find(Input).length).toBe(0);
      component.simulate('doubleclick');
      expect(component.find(Input).length).toBe(1);
    });

    it('Для переименования передается идентификатор и новое имя тудушки', () => {
      const component = fullRenderComponent({
        todoData: normalTodoData,
        operations: {
          ...normalOperations,
          changeTodoName: jest.fn(),
        },
      });

      component.setState({ editableName: 'New name' });
      component.instance().submitName();
      expect(component.props().operations.changeTodoName).toBeCalledWith(normalTodoData.id, 'New name');
    });

    it('Отмена изменения', () => {
      const component = renderComponent({
        todoData: normalTodoData,
      });
      const initialName = component.instance().props.todoData.name;

      expect(component.state('editableName')).toEqual(initialName);

      component.setState({ editableName: 'Начали писать новое имя' });
      component.instance().cancel();

      expect(component.state('editableName')).toEqual(initialName);
    });

    it('При вводе значение пишется в state', () => {
      const component = renderComponent({
        todoData: normalTodoData,
      });

      expect(component.state('editableName')).toEqual(component.instance().props.todoData.name);

      component.setState({ onEditing: true });
      component.find(Input).simulate('change', { target: { value: 'Новое имя тудухи' } });

      expect(component.state('editableName')).toEqual('Новое имя тудухи');
    });
  });

  it('Для удаления передается идентификатор тудушки', () => {
    const component = fullRenderComponent({
      todoData: normalTodoData,
      operations: {
        ...normalOperations,
        removeTodo: jest.fn(),
      },
    });

    component.instance().removeItem();
    expect(component.props().operations.removeTodo).toBeCalledWith(normalTodoData.id);
  });

  it('Если тудушка выполнена, навешивается класс "todo-item__name--done"', () => {
    const component = renderComponent();

    expect(component.find('.todo-item__name')).not.toHaveClassName('todo-item__name--done');
    component.setProps({ todoData: { done: true } });
    expect(component.find('.todo-item__name')).toHaveClassName('todo-item__name--done');
  });
});
