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
});
