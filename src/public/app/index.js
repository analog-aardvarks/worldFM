import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './components/App';
import reducer from './reducers';

console.log('test');

const actionLogger = ({ dispatch, getState }) =>
  (next) => (action) =>
    { console.log(action); return next(action); }

const middleware = applyMiddleware(actionLogger);

const store = createStore(
  reducer
  // compose(
  //   middleware,
  //   window.devToolsExtension ? window.devToolsExtension() : f => f,
  // )
);


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

export default store;
