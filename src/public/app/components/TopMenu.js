import React from 'react';
import Select from 'react-select';

const TopMenu = ({ toggleCountryMenu, toggleQueueMenu, toggleSpotifyPlaylist, toggleSideMenu, availableCountries, handleCountryChange, currentCountry}) => {

  const countries = availableCountries.reduce((acc, country) => {
      acc.push({value:country, label:country})
      return acc;
    }, []);


  return (
    <div className="Menu">
      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu}></i>
      <h1 className='Menu--logo'>world.fm</h1>
      <div className="TopMenu">
        <Select
          className="TopMenu--CountryDropdown"
          value={currentCountry}
          options={countries}
          onChange={handleCountryChange}
          clearable={false}
          // placeholder="Select a country.."    doesn't work beacause initial value is selected
        />
        <span className="CountryMenu--toggle" onClick={toggleCountryMenu}> <i className="fa fa fa-globe fa-lg fa-fw" /></span>
        {/* <span className="SpotifyPlaylist--toggle" onClick={toggleSpotifyPlaylist}>Playlist</span> */}
        {/* <span className="QueueMenu--toggle" onClick={toggleQueueMenu}>Queue</span> */}
        {/* <a className="Menu--login" href="/auth/spotify">Login</a> */}
        <a className="Menu--login" href="/auth/spotify"> <i className="fa fa fa-spotify fa-lg fa-fw" /></a>
      </div>
    </div>
  )
}

export default TopMenu;
