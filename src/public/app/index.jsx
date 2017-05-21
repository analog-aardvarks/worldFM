import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { HashRouter, Route, Link } from 'react-router-dom';
import App from './components/App.jsx'
import Landing from './components/Landing.jsx';
import reducer from './reducers';

let store = createStore(reducer);

render(
  <Provider store={store}>
    <HashRouter>
      <div>
        <Route exact path="/" component={Landing} />
        <Route exact path="/playlist" component={App} />
      </div>
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);
