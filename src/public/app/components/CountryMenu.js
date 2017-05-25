import React from 'react';

const CountryMenu = ({ availableCountries, availableTrends, currentCountry, currentTrend, handleCountryChange, handleTrendChange, showCountryMenu, toggleTrackInfo }) => {
  return (
    <div className="CountryMenu" style={{ display:  showCountryMenu ? "block" : "none" }}>
      <span className="Menu--toggle" onClick={toggleTrackInfo}>Info</span>
      <div className="CountryList">
        <label>Pick a country!</label>
        <select
          className="Menu--dropdown"
          value={currentCountry}
          onChange={handleCountryChange}
        >
          {availableCountries.map((country, idx) => <option key={idx}>{country}</option>)}
        </select>
        <label>Pick a category!</label>
        <select
          className="Menu--dropdown"
          value ={currentTrend}
          onChange={handleTrendChange}
        >
          {availableTrends.map((trend, idx) => <option key={idx}>{trend}</option>)}
        </select>
      </div>
    </div>
  )
}
export default CountryMenu;
