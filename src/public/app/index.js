import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './components/App'
import reducer from './reducers';

const actionLogger = ({dispatch, getState}) =>
  (next) => (action) =>
    { console.log(action); return next(action) }

const middleware = applyMiddleware(actionLogger);

const store = createStore(reducer, middleware);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
