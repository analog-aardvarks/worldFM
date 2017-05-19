import React from 'react';
import { Route, Link } from 'react-router-dom';

const Landing = () => <h1>Welcome to the Landing Page</h1>;
const World = props => <h1>Welcome to the {props.match.params.data} Page</h1>;

const routes = (
  <div>
    <Route exact path="/" component={Landing} />
    <Route path="/:data" component={World} />

    <ul>
      <li><Link to="/Spain">Spain</Link></li>
      <li><Link to="/Italy">Italy</Link></li>
      <li><Link to="/Germany">Germany</Link></li>
    </ul>

    <p>Try typing a different country directly on the URL!</p>
  </div>
);

module.exports = routes;
