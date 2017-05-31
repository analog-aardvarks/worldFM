import React from 'react';

const CountryMenu = ({ availableCountries, availableTrends, currentCountry, currentTrend, handleCountryChange, handleTrendChange, showCountryMenu, toggleCountryMenu, toggleTrackInfo }) => {

  return (
    <div className="CountryMenu" style={{ display:  showCountryMenu ? "block" : "none" }}>

      <div className="CountryMenu-TopSection">
        <i className="fa fa fa-times fa-lg fa-fw" onClick={toggleCountryMenu} />
        <i className="a fa fa-info-circle fa-lg fa-fw" onClick={toggleTrackInfo} />
      </div>

      <div className="CountryMenu--Section">
        <select
          className="Trend--dropdown"
          value={currentTrend}
          onChange={handleTrendChange}
          size="4"
        >
          {availableTrends.map((trend, idx) => <option key={idx}>{trend}</option>)}
        </select>
      </div>

      <div className="CountryMenu--Section">
        <select
          className="Country--dropdown"
          value={currentCountry}
          onChange={handleCountryChange}
          size="6"
        >
          {availableCountries.map((country, idx) => <option key={idx}>{country}</option>)}
        </select>
      </div>

    </div>
  )
}
export default CountryMenu;
