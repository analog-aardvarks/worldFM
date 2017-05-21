import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Routes from './containers/Routes.jsx';
import reducer from './reducers';

let store = createStore(reducer);

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('app')
);
