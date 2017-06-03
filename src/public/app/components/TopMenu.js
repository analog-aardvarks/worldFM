import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

const mapStateToProps = state => ({
  showTopMenu: state.showTopMenu,
  windowHeight: state.windowHeight,
})

const mapDispatchToProps = dispatch => ({
  // showTopMenuEvent: () => dispatch({ type: 'SHOW_TOP_MENU' }), //TODO
  // hideTopMenu: () => dispatch({ type: 'HIDE_TOP_MENU' }), //TODO
})

const TopMenu = ({ windowHeight, oggleCountryMenu, toggleQueueMenu, toggleFavoritesMenu, toggleSpotifyPlaylist, toggleSideMenu, availableCountries, handleCountryChange, currentCountry, auth, toggleTopMenu, showTopMenu }) => {

  const countries = availableCountries.reduce((acc, country) => {
      acc.push({value:country, label:country})
      return acc;
    }, []);

  const scrollUp = () => {
    const sweetScroll = new SweetScroll();
    // sweetScroll.toElement(document.getElementsByClassName('globeMenu'));
    console.log('scrolling up');
    sweetScroll.to(0, 0);
  };

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
    <div className="TopMenu" style={{ background: showTopMenu ? 'linear-gradient(#171717, #1C1C1C)' : 'rgba(0, 0, 0, 0)' }}>

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
