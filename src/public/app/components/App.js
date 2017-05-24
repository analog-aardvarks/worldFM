import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import Player from '../containers/Player';
import UserPlayList from './UserPlayList';

const App = () => (
  <div>
    <Player />
    <Menu />
    <UserPlayList />
    <Playlist />
  </div>
);

export default App;
