import React, { Component } from 'react';
// import VirtualizedSelect from 'react-virtualized-select';
import Select from 'react-select';
// import createFilterOptions from 'react-select-fast-filter-options';
import countries from '../constants/availableCountries';
// import SweetScroll from 'sweet-scroll';

class SelectCountry extends Component {
  constructor(props) {
    super(props);

    this.options = countries.map(country => ({ label: country, value: country }));
  }

  handleOnChange(newValue) {
    console.log(newValue);
    this.props.handleClearGenre();
    this.props.handleSetCountry(newValue);
  }

  render() {
    const { currentCountry } = this.props;
    // const options = countries.map(country => ({ label: country, value: country }));
    // const filterOptions = createFilterOptions({ options });

    return (
      // <VirtualizedSelect
      //   className="TopMenu--CountryDropdown"
      //   disabled={false}
      //   filterOptions={filterOptions}
      //   onChange={selectValue => this.handleOnChange(selectValue)}
      //   options={options}
      //   simpleValue
      //   value={this.props.currentCountry}
      // />
      <Select
        value={currentCountry}
        onChange={newValue => this.handleOnChange(newValue)}
        options={this.options}
      />
    );
  }
}

export default SelectCountry;
