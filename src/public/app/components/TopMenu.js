import React from 'react';

const TopMenu = ({
  auth,
  toggleCountryMenu,
  toggleQueueMenu,
  toggleSpotifyPlaylist,
  toggleSideMenu }) => {
    console.log(auth)
  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu} />
      <h1 className="Menu--logo">world.fm</h1>
      <div className="TopMenu">
        <span
          className="CountryMenu--toggle"
          onClick={toggleCountryMenu}
        >
          <i className="fa fa fa-globe fa-lg fa-fw" />
        </span>
        {/* <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span> */}
        {/* <span className="QueueMenu--toggle" onClick={toggleQueueMenu}>Queue</span> */}
        {/* <a className="Menu--login" href="/auth/spotify">Login</a> */}
        <a
          className="Menu--login"
          href="/auth/spotify"
        >
          <i
            className="fa fa fa-spotify fa-lg fa-fw"
            style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}
          />
        </a>
      </div>
    </div>
  )
}

export default TopMenu;
