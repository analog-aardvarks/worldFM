import React from 'react';
import Select from 'react-select';

const TopMenu = ({ toggleCountryMenu, toggleQueueMenu, toggleSpotifyPlaylist, toggleSideMenu, availableCountries, handleCountryChange, currentCountry, auth }) => {

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
    window.scrollTo(0,560);
  }

  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu}></i>

      <i className="Mobile--icon fa fa-bars fa-2x fa-fw"></i>
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
        {/* <span className="CountryMenu--stoggle" onClick={toggleCountryMenu}> <i className="fa fa fa-globe fa-lg fa-fw" /></span> */}
        <span><img src="../../assets/icon-fire.png" className="FireIcon" width="26px" /></span>
        <span className="CountryMenu--toggle" onClick={scrollUp}> <i className="fa fa fa-globe fa-lg fa-fw" /></span>
        <span className="ScrollDown--button" onClick={scrollDown}> <i className="fa fa fa-angle-down fa-lg fa-fw" /></span>

        {/* <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span> */}
        <span className="QueueMenu--toggle" onClick={toggleQueueMenu}>Queue</span>
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
