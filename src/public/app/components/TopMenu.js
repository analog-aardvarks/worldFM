import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showTopMenu: state.showTopMenu,
})

const mapDispatchToProps = dispatch => ({

})

const TopMenu = ({ toggleCountryMenu, toggleQueueMenu, toggleFavoritesMenu, toggleSpotifyPlaylist, toggleSideMenu, availableCountries, handleCountryChange, currentCountry, auth, toggleTopMenu, showTopMenu }) => {

  const countries = availableCountries.reduce((acc, country) => {
      acc.push({value:country, label:country})
      return acc;
    }, []);

  const scrollUp = () => {
    console.log('scrolling up')
    window.scrollTo(0,0);
  }

  let height = window.innerHeight - 63;

  window.onscroll = () => {
    if (window.pageYOffset >= height && showTopMenu === false) {
      toggleTopMenu();
    }
    else if (window.pageYOffset < height && showTopMenu === true) {
      toggleTopMenu();
    }
  }

  return (
    <div className="TopMenu" style={{ background: showTopMenu ? 'linear-gradient(#1C1C1C, #212121, #1E1E1E, #080808)' : 'rgba(0, 0, 0, 0)' }}>

      <i className="Mobile--icon fa fa-bars fa-2x fa-fw" onClick={toggleSideMenu}></i>

      <a className='Menu--logo' href="/">world.fm</a>
      <div className="TopMenu__content">
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

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
