import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import App from '../components/App.jsx'

const Landing = () => (
  <div>
    <h1>Welcome to the Landing Page</h1>
    <ul>
      <li><Link to="/Playlist">Playlist Component</Link></li>
    </ul>
  </div>
);

const Routes = () => (
  <HashRouter>
    <div>
      <Route exact path="/" component={Landing} />
      <Route exact path="/playlist" component={App} />
    </div>
  </HashRouter>
);

module.exports = Routes;
