import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import HiddenPlayer from '../containers/HiddenPlayer';
import UserPlayList from './UserPlayList';
import Player from './Player';

const App = () => (
  <div>
    <HiddenPlayer />
    <Menu />
    <UserPlayList />
    <Playlist />
    <Player />
  </div>
);

export default App;
