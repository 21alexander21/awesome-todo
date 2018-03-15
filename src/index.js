// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
import registerServiceWorker from './registerServiceWorker';
import './static/styles/global.css';
// import { FakeApi } from './utils/index';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
