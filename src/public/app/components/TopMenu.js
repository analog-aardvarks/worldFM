import React from 'react';

const TopMenu = ({ toggleCountryMenu, toggleQueMenu, toggleSpotifyPlaylist }) => {
  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw"></i>
      <h1 className='Menu--logo'>world.fm</h1>
      <div className="Desktop">
        <span className="CountryMenu--toggle" onClick={toggleCountryMenu}>Countries</span>
        <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span>
        <span className="QueMenu--toggle" onClick={toggleQueMenu}>Que</span>
        <span className="Menu--login" href="/auth/spotify">Login</span>
      </div>
    </div>
  )
}

export default TopMenu;
