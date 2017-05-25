import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import Player from '../containers/Player';
import Globe from '../containers/Globe';

const App = () => (
  <div>
    <Player />
    <Globe />
    <Menu />
    <Playlist />
  </div>
);

export default App;
