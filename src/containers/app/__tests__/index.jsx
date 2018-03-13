import React from 'react';
import {
  shallow,
  mount,
} from 'enzyme';
import App from '../';

const render = () => shallow(React.createElement(App));
const fullRender = () => mount(React.createElement(App));

describe('Контэйнер <App />', () => {
  it('Рендер', () => {
    // console.log(render());
    expect(render()).toHaveLength(1);
  });

  it('Список тудушек рэндерится', () => {
    expect(fullRender().find('List')).toHaveLength(1);
  });
});
