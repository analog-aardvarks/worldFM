import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import routes from './app/config/routes.jsx';

ReactDOM.render(
  <Router>{routes}</Router>,
  document.getElementById('app')
);
