import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import Spinner from '@skbkontur/react-ui/Spinner';
import List from '../';

const renderComponent = (props, routerState) =>
  // eslint-disable-next-line function-paren-newline
  mount(
    <MemoryRouter {...routerState}>
      <Route path="/:filter?" render={routeProps => <List {...props} {...routeProps} />} />
    </MemoryRouter>,
    // eslint-disable-next-line function-paren-newline
  );

describe('Компонент <List />', () => {
  it('Рендер', () => {
    const component = renderComponent();

    expect(component).toExist();
  });

  it('Во время загрузки рендерится <Spinner />', () => {
    const component = renderComponent({ fetching: true });

    expect(component.find(Spinner)).toHaveLength(1);
  });

  it('Если не определен фильтр, рендерятся все тудушки', () => {
    const component = renderComponent({
      todos: [
        {
          id: '_0001',
          name: 'Todo1',
          done: false,
        },
        {
          id: '_0002',
          name: 'Todo2',
          done: true,
        },
        {
          id: '_0003',
          name: 'Todo3',
          done: false,
        },
      ],
    });

    expect(component.find('TodoItem')).toHaveLength(3);
  });

  it('Если удалось получить фильтр из роутера, тудушки фильтруются', () => {
    const component = renderComponent(
      {
        todos: [
          {
            id: '_0001',
            name: 'Todo1',
            done: false,
          },
          {
            id: '_0002',
            name: 'Todo2',
            done: true,
          },
          {
            id: '_0003',
            name: 'Todo3',
            done: false,
          },
        ],
      },
      {
        initialEntries: [{ pathname: '/active' }],
        initialIndex: 0,
      },
    );

    expect(component.find('TodoItem')).toHaveLength(2);
  });
});
