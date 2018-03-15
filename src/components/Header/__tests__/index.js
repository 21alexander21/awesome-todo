import React from 'react';
import { mount, shallow } from 'enzyme';
import Header from '../';

const normalProps = {
  createTodo: jest.fn(),
};
const fullRenderComponent = (props = normalProps) => mount(React.createElement(Header, props));
const renderComponent = (props = normalProps) => shallow(React.createElement(Header, props));

describe('Компонент <Header />', () => {
  it('Рендерится', () => {
    expect(renderComponent()).toHaveLength(1);
  });

  it('Не падает без обязательных пропсов', () => {
    expect(renderComponent({})).toHaveLength(1);
  });

  it('changeNewTodoName вызывается на onChange формы', () => {
    const component = fullRenderComponent();
    component.instance().changeNewTodoName = jest.fn();
    component.update();
    component.find('input').simulate(
      'change',
      {
        target: {
          id: component.instance().fieldName,
          value: 'New Name',
        },
      },
    );

    expect(component.instance().changeNewTodoName).toBeCalledWith('New Name');
  });

  it('Введенное имя записывается в локальный state', () => {
    const component = fullRenderComponent();
    component.find('input').simulate(
      'change',
      {
        target: {
          id: component.instance().fieldName,
          value: 'Новая тудушка',
        },
      },
    );

    expect(component.state('newTodoName')).toEqual('Новая тудушка');
  });

  it('createTodo вызывается с текущим стэйтом', () => {
    const component = renderComponent();

    component.setState({ newTodoName: 'Новое имя' });
    component.instance().submitHandler();

    expect(component.instance().props.createTodo).toBeCalledWith('Новое имя');
  });

  it('После сабмита имя возвращается к дефолтному', () => {
    const component = renderComponent();
    const defaultName = component.state('newTodoName');

    component.setState({ newTodoName: 'Новое имя 43 52' });
    component.instance().submitHandler();

    expect(component.state('newTodoName')).toEqual(defaultName);
  });

  it('Компонент принимает дефолтное новое имя', () => {
    const component = renderComponent({ defaultNewTodoName: 'Дефолтное новое имя' });

    expect(component.state('newTodoName')).toEqual('Дефолтное новое имя');
  });
});
