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

  it('По двойному клику появляется инпут', () => {
    const component = fullRenderComponent({
      todoData: normalTodoData,
      operations: normalOperations,
    });

    expect(component.find(Input)).not.toExist();
    component.simulate('doubleclick');
    expect(component.find(Input)).toHaveLength(1);
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

  it('Для переименования передается идентификатор и новое имя тудушки', () => {
    const component = fullRenderComponent({
      todoData: normalTodoData,
      operations: {
        ...normalOperations,
        changeTodoName: jest.fn(),
      },
    });

    component.instance().changeHandler({ target: { value: 'New name' } });
    component.instance().submitName();
    expect(component.props().operations.changeTodoName).toBeCalledWith(normalTodoData.id, 'New name');
  });
});
