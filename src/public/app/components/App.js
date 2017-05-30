import React from 'react';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import HiddenPlayer from '../containers/HiddenPlayer';
import UserPlayList from './UserPlayList';
import Player from './Player';
import ConnectedGlobe from '../containers/GlobeMenu';
import '../styles/main.scss';
import About from './About';

const showGlobe = true;

const App = () => (
  <div>
    <HiddenPlayer />
    {showGlobe ? <ConnectedGlobe /> : null}
    <Menu />
    <Playlist />
    <Player />
    <About />
  </div>
);

export default App;
