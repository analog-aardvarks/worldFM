import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

import SelectGenre from './SelectGenre';
import SelectCountry from './SelectCountry';

const mapStateToProps = state => ({
  auth: state.auth,
  showTopMenu: state.showTopMenu,
  currentCountry: state.currentCountry,
  currentGenre: state.currentGenre,
})

const mapDispatchToProps = dispatch => ({
  handleSetCountry: (country) => dispatch({ type: 'SET_CURRENT_COUNTRY', country }),
  handleClearCountry: () => dispatch({ type: 'CLEAR_CURRENT_COUNTRY' }),
  handleSetGenre: (genre) => dispatch({ type: 'SET_CURRENT_GENRE', genre }),
  handleClearGenre: () => dispatch({ type: 'CLEAR_CURRENT_GENRE' }),
})

const TopMenu = ({
  auth,
  showTopMenu,
  toggleTopMenu,
  toggleFavoritesMenu,
  toggleSideMenu,
  currentCountry,
  currentGenre,
  handleSetCountry,
  handleClearCountry,
  handleSetGenre,
  handleClearGenre,
  }) => {

  const scrollUp = () => {
    const sweetScroll = new SweetScroll();
    sweetScroll.to(0, 0);
  };

  let height = window.innerHeight - 63;

  window.onscroll = () => {
    if (window.pageYOffset >= height && showTopMenu === false) toggleTopMenu();
    else if (window.pageYOffset < height && showTopMenu === true) toggleTopMenu();
  }

  return (
    <div
      className="TopMenu"
      style={{ background: showTopMenu ? 'linear-gradient(#1C1C1C, #212121, #1E1E1E, #080808)' : 'rgba(0, 0, 0, 0)' }}
    >
      <i
        className="Mobile--icon fa fa-bars fa-2x fa-fw"
        onClick={toggleSideMenu}
      />

      <a
        className="Menu--logo"
        href="/"
      >
        World.FM
      </a>
      <div className="TopMenu__content">

        <SelectGenre
          currentGenre={currentGenre}
          handleSetGenre={handleSetGenre}
          handleClearCountry={handleClearCountry}
        />
        <SelectCountry
          currentCountry={currentCountry}
          handleSetCountry={handleSetCountry}
          handleClearGenre={handleClearGenre}
        />

        <div className="GlobeView--toggle TopMenu__icon">
          <i
            className="fa fa fa-globe fa-lg fa-fw"
            onClick={scrollUp}
            data-tip="Select a new country"
          />
        </div>

        <div className="FavoritesMenu--toggle TopMenu__icon">
          <i
            className="fa fa fa-heart fa-lg fa-fw"
            onClick={toggleFavoritesMenu}
            data-tip="View Favorites"
          />
        </div>

        <a className="TopMenu--login TopMenu__icon" href="/auth/spotify">
          <i
            className="fa fa fa-spotify fa-lg fa-fw"
            style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}
            data-tip="Connect with Spotify"
          />
        </a>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
