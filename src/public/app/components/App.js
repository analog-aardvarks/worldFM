import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import Player from '../containers/Player';
import GlobeMenu from '../containers/GlobeMenu';

const App = () => (
  <div>
    <Player />
    <GlobeMenu />
    <Menu />
    <Playlist />
  </div>
);

export default App;
