import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    <h1>Welcome to the Landing Page</h1>
    <ul>
      <li><Link to="/Playlist">Playlist Component</Link></li>
    </ul>
  </div>
);

export default Landing;
