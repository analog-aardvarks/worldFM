import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showCountryMenu: state.showCountryMenu,
})

const mapDispatchToProps = dispatch => ({
  hideCountryMenuEvent: () => dispatch({ type: 'HIDE_COUNTRY_MENU' }),
})

const CountryMenu = ({ showCountryMenu, hideCountryMenuEvent}) => {
  console.log(hideCountryMenuEvent)
  return (
    <div className="CountryMenu" style={{ opacity:  showCountryMenu ? 1 : 0 }}>
      <h1>Country List!</h1>
      <div className="CountryList">
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
        <li>test</li>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryMenu);
