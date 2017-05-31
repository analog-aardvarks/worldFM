import React from 'react';
// import ReactDOM from 'react-dom';
// import { slide as Menu } from 'react-burger-menu'

const BurgerMenu = ({ toggleAbout, toggleCountryMenu, toggleSpotifyPlaylist, toggleQueueMenu, toggleLogin }) => {
  return (
    <div className="SideMenu">
      <span href="/about" className="About--toggle" onClick={toggleAbout}>About</span>
      <span href="/country" className="CountryMenu--toggle" onClick={toggleCountryMenu}>Countries</span>
      <span href="/playlist" className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span>
      <span href="/queue" className="QueueMenu--toggle" onClick={() => { toggleQueueMenu(); }}>Queue</span>
      <span href="/login" className="Login--toggle" onClick={toggleLogin}>Login</span>
    </div>
  );
};
export default BurgerMenu;
