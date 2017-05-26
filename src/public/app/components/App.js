import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import HiddenPlayer from '../containers/HiddenPlayer';
import UserPlayList from './UserPlayList';
import Player from './Player';
import GlobeMenu from '../containers/GlobeMenu';

const showGlobe = true;

const App = () => (
  <div>
    <HiddenPlayer />
    {showGlobe ? <GlobeMenu /> : null}
    <Menu />
    <UserPlayList />
    <Playlist />
    <Player />
  </div>
);

export default App;
