// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
import { FakeApi } from './utils';
import './static/styles/global.css';

const container = document && document.getElementById('root');

if (!container) {
  throw new Error('Нет элемента, в котором рендерится React');
}

ReactDOM.render(<App api={new FakeApi()} />, container);
