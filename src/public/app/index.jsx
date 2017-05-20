import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import routes from './config/routes.jsx';
import reducer from './reducers';

let store = createStore(reducer);

render(
  <Provider store={store}>
    <Router>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
);
