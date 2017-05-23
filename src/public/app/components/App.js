import React from 'react';
import Menu from './Menu';
import Playlist from '../containers/Playlist';
import Player from '../containers/Player';

const App = () => (
  <div>
    <Menu />
    <Playlist />
    <Player />
  </div>
);

export default App;
