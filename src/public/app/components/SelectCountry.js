import React, { Component } from 'react';
import Select from 'react-select';
import countries from '../constants/availableCountries';

class SelectCountry extends Component {
  constructor(props) {
    super(props);

    this.options = countries.map(country => ({ label: country, value: country }));
  }

  handleOnChange(option) {
    this.props.handleClearGenre();
    this.props.handleSetCountry(option.value);
  }

  render() {
    return (
      <Select
        className="TopMenu--CountryDropdown"
        onChange={option => this.handleOnChange(option)}
        options={this.options}
      />
    );
  }
}

export default SelectCountry;
