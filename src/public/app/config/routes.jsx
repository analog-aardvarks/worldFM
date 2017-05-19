import React from 'react';
import { Route, Link } from 'react-router-dom';
import Playlist from './../components/Playlist.jsx'

const Landing = () => (
  <div>
    <h1>Welcome to the Landing Page</h1>
    <ul>
      <li><Link to="/Playlist">Playlist Component</Link></li>
    </ul>
  </div>
);

const routes = (
  <div>
    <Route exact path="/" component={Landing} />
    <Route exact path="/playlist" component={Playlist} />
  </div>
);

module.exports = routes;
