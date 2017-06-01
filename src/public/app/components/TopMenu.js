import React from 'react';
import Select from 'react-select';

const TopMenu = ({ toggleCountryMenu, toggleQueueMenu, toggleFavoritesMenu, toggleSpotifyPlaylist, toggleSideMenu, availableCountries, handleCountryChange, currentCountry, auth, windowHeight, windowWidth}) => {

  const countries = availableCountries.reduce((acc, country) => {
      acc.push({value:country, label:country})
      return acc;
    }, []);

  const scrollUp = () => {
    console.log('scrolling up')
    window.scrollTo(0,0);
  }

  const scrollDown = () => {
    console.log('scrolling down')
    window.scrollTo(0, windowHeight - 60);
  }

  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu}></i>
      <a className='Menu--logo' href="/">world.fm</a>
      <div className="TopMenu">
        <Select
          className="TopMenu--CountryDropdown"
          value={currentCountry}
          options={countries}
          onChange={handleCountryChange}
          clearable={false}
          // placeholder="Select a country.."    doesn't work beacause initial value is selected
      />

      <div className="GlobeView--toggle" onClick={scrollUp}>
        <i className="fa fa fa-globe fa-lg fa-fw" />
        <span>globe</span>
      </div>

      <div className="FavoritesMenu--toggle">
        <i className="fa fa fa-heart fa-lg fa-fw" onClick={toggleFavoritesMenu} />
        <span>faves</span>
      </div>

      <a className="TopMenu--login" href="/auth/spotify">
        <i className="fa fa fa-spotify fa-lg fa-fw" style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}/>
        <span>connect with spotify</span>
      </a>

        {/* scroll down arrow button */}
      <span className="ScrollDown--button" style={{left: (windowWidth/2) - 45}} onClick={scrollDown}><i className="fa fa fa-angle-down fa-lg fa-fw" /></span>

        {/* CURRENTLY UNUSED */}
        {/* <span className="CountryMenu--stoggle" onClick={toggleCountryMenu}> <i className="fa fa fa-globe fa-lg fa-fw" /></span> */}
        {/* <span><img src="../../assets/icon-fire.png" className="FireIcon" width="26px" /></span> */}
        {/* <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span> */}
        {/* <span className="QueueMenu--toggle" onClick={toggleQueueMenu}>Queue</span> */}
        {/* <a className="Menu--login" href="/auth/spotify">Login</a> */}

      </div>
    </div>
  )
}

export default TopMenu;
