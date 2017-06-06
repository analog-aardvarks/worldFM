import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

import SelectGenre from './SelectGenre';
import SelectCountry from './SelectCountry';

const mapStateToProps = state => ({
  auth: state.auth,
  showTopMenu: state.showTopMenu,
  showUserMenu: state.showUserMenu,
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
  showFavoritesMenu,
  showUserMenu,
  toggleTopMenu,
  toggleFavoritesMenu,
  toggleSideMenu,
  toggleUserMenu,
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
        className="Hamburger--icon TopMenu__icon fa fa-bars fa-2x fa-fw"
        onClick={toggleSideMenu}
      />
      <a
        className="Menu--logo TopMenu__icon"
        href="/"
      >
        World.FM
      </a>




      <div className="TopMenu__content">

        <div
          className="GlobeView--toggle TopMenu__icon"
          style={{
            display: showTopMenu ? "block" : "none",
            // right: (window.innerWidth/2) - 31
          }}
          >
          <i
            className="fa fa fa-globe fa-4x fa-fw"
            onClick={scrollUp}
          />
        </div>

        <div className="TopMenu--CountryDropdown">
          <SelectCountry
            currentCountry={currentCountry}
            handleSetCountry={handleSetCountry}
            handleClearGenre={handleClearGenre}
          />
        </div>

       <SelectGenre
          currentGenre={currentGenre}
          handleSetGenre={handleSetGenre}
          handleClearCountry={handleClearCountry}
        />

         {/* <div className="FavoritesMenu--toggle TopMenu__icon">
          <i
            className="fa fa fa-heart fa-lg fa-fw"
            onClick={toggleFavoritesMenu}
          />
        </div> */}

        <a className="TopMenu--login TopMenu__icon" href="/auth/spotify">
          <i
            className="fa fa fa-spotify fa-lg fa-fw"
            // style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}
            style={{ display: auth ? 'none' : 'block' }}
          />
        </a>

        { auth ?
          <div className="TopMenu--user">
            {/* <img src="https://res.cloudinary.com/teepublic/image/private/s--qOgRk5e6--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1446245688/production/designs/302097_1.jpg" height= {40} /> */}
            <i
              className="TopMenu--login fa fa fa-spotify fa-2x fa-fw"
              style={{ color: auth ? 'rgb(30, 215, 96)' : 'rgb(230, 230, 230)' }}
              // style={{ display: auth ? 'none' : 'block' }}
            />
            <i className= {showUserMenu ? "fa fa fa-chevron-up fa-1x fa-fw TopMenu__icon" : "fa fa fa-chevron-down fa-1x fa-fw TopMenu__icon" } onClick={toggleUserMenu} />
          </div> : null}

        {
          // !showFavoritesMenu &&
          showUserMenu ?
          <div className="TopMenu--userMenu" style={{ backgroundColor: showTopMenu ? '#080808' : 'rgba(0, 0, 0, 0)' }}>
            <div onClick={toggleFavoritesMenu} className="TopMenu__icon">
              <i className="fa fa fa-heart fa-lg fa-fw" />
              <span>favorites</span>
            </div>
            <div className="TopMenu__icon">
              <a href="/auth/spotify">
                <i className="fa fa fa-sign-out fa-lg fa-fw" />
                <span>logout</span>
              </a>
            </div>
          </div>
        : null }

      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
