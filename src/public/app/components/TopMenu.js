import React from 'react';

const TopMenu = ({ toggleCountryMenu, toggleSpotifyPlaylist, toggleSideMenu }) => {
  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu}></i>
      <h1 className='Menu--logo'>world.fm</h1>
      <div className="Desktop">
        <span className="CountryMenu--toggle" onClick={toggleCountryMenu}>Countries</span>
        <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span>
        <a className="Menu--login" href="/auth/spotify">Login</a>
      </div>
    </div>
  )
}

export default TopMenu;
