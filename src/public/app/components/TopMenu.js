import React from 'react';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

import SelectGenre from './SelectGenre';
import SelectCountry from './SelectCountry';

const mapStateToProps = state => ({
  auth: state.auth,
  aboveFold: state.aboveFold,
  showUserMenu: state.showUserMenu,
  showCountryDropdown: state.showCountryDropdown,
  currentCountry: state.currentCountry,
  currentGenre: state.currentGenre,
  windowWidth: state.windowWidth,
});

const mapDispatchToProps = dispatch => ({
  handleClearCountry: () => dispatch({ type: 'CLEAR_CURRENT_COUNTRY' }),
  handleClearGenre: () => dispatch({ type: 'CLEAR_CURRENT_GENRE' }),
  handleHideCountryDropdown: () => dispatch({ type: 'HIDE_COUNTRY_DROPDOWN' }),
  handleSetCountry: country => dispatch({ type: 'SET_CURRENT_COUNTRY', country }),
  handleSetGenre: genre => dispatch({ type: 'SET_CURRENT_GENRE', genre }),
  handleShowCountryDropdown: () => dispatch({ type: 'SHOW_COUNTRY_DROPDOWN' }),
});

const scrollUp = () => {
  const sweetScroll = new SweetScroll();
  sweetScroll.to(0, 0);
};

const TopMenu = ({
  // showUserMenu,
  // toggleSideMenu,
  // toggleUserMenu,
  auth,
  aboveFold,
  currentCountry,
  currentGenre,
  handleClearCountry,
  handleClearGenre,
  handleHideCountryDropdown,
  handleSetCountry,
  handleSetGenre,
  handleShowCountryDropdown,
  showCountryDropdown,
  showFavoritesMenu,
  toggleFavoritesMenu,
  windowWidth,
  }) => {

  return (
    <div
      className={`TopMenu${!aboveFold ? ' solid' : ''}`}
    >

      <div className="Menu--logo">
        <img src="../../assets/worldfmlogo.svg" />
      </div>

      <div className="TopMenu__content" style={{ width: windowWidth }}>

        <div
          className="GlobeView--toggle TopMenu__icon"
        >
          <i
            className="fa fa fa-globe fa-4x fa-fw"
            onClick={scrollUp}
            data-tip="Select a new country"
          />
        </div>

        <div className="TopMenu__dropdownOptions">
          <span
            onClick={handleShowCountryDropdown}
            style={{ color: showCountryDropdown ? 'rgb(30, 215, 96)' : 'grey' }}
            data-tip="Explore the world of music"
          >
            COUNTRY
          </span>
          <span
            onClick={handleHideCountryDropdown}
            style={{ color: !showCountryDropdown ? 'rgb(30, 215, 96)' : 'grey' }}
            data-tip="Explore the world of genres"
          >
            GENRE
          </span>
        </div>

        {showCountryDropdown ?
          <div className="TopMenu--CountryDropdown">
            <SelectCountry
              currentCountry={currentCountry}
              handleSetCountry={handleSetCountry}
              handleClearGenre={handleClearGenre}
            />
          </div>
          : null
        }

        {!showCountryDropdown ?
          <div className="TopMenu--GenreDropdown">
            <SelectGenre
              currentGenre={currentGenre}
              handleSetGenre={handleSetGenre}
              handleClearCountry={handleClearCountry}
            />
          </div>
          : null
        }

        <div
          className="FavoritesMenu--toggle TopMenu__icon"
          style={{
            opacity: auth ? 1 : 0,
            zIndex: auth ? 10 : -80,
          }}
        >
          <i
            className="fa fa fa-heart fa-lg fa-fw"
            onClick={() => {
              if (auth) toggleFavoritesMenu();
            }}
            data-tip="Favorites"
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
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
