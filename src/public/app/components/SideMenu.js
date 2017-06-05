import React from 'react';

const SideMenu = ({
  // toggleAbout,
  // toggleLogin,
  toggleCountryMenu,
  toggleFavoritesMenu,
  toggleSpotifyPlaylist,
  showQueueMenu,
  windowHeight,
}) => {

  return (
    <div
      className="SideMenu"
      style={{ height: showQueueMenu ? windowHeight - 200 : windowHeight - 124 }}
      >

      {/* <span href="/about" className="About--toggle" onClick={toggleAbout}>About</span> */}
      {/* <span href="/country" className="CountryMenu--toggle" onClick={toggleCountryMenu}>Countries</span> */}
      {/* <span href="/playlist" className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span> */}
      {/* <span href="/queue" className="QueueMenu--toggle" onClick={() => { toggleQueueMenu(); }}>Queue</span> */}
      {/* <span href="/login" className="Login--toggle">Login</span> */}

      <div>
        <a className="SideMenu--login" href="/auth/spotify">
          <i
            className="fa fa fa-spotify fa-lg fa-fw"
            // style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}
          />
          <span> connect with Spotify</span>
        </a>
      </div>

      <div className="SideMenu--FavoritesMenuToggle" onClick={toggleFavoritesMenu}>
        <i className="fa fa fa-heart fa-lg fa-fw" />
        <span> favorites</span>
      </div>

      <div className="SideMenu--QueueMenuToggle">
        <i className="fa fa fa-list fa-lg fa-fw"/>
        <span> queue</span>
      </div>

      <div>
        <i className="fa fa fa-info fa-lg fa-fw"/>
        <span> about us</span>
      </div>

    </div>
  );
};
export default SideMenu;
