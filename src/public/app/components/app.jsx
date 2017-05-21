import React from 'react';
import Menu from './Menu.jsx';
import CurrentPlaylist from '../containers/CurrentPlaylist.jsx';
import Player from '../containers/Player.jsx';

const App = () => (
  <div>
    <Menu />
    <CurrentPlaylist />
    <Player />
  </div>
);

export default App;
