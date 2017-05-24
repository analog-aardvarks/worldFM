import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import Player from '../containers/Player';

const App = () => (
  <div>
    <Player />
    <Menu />
    <Playlist />
  </div>
);

export default App;
