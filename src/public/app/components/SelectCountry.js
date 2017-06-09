import React, { Component } from 'react'
import VirtualizedSelect from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options';
import countries from '../constants/availableCountries';
import SweetScroll from 'sweet-scroll';

class SelectCountry extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const options = countries.map(g => ({ value: g, label: g }));
    const filterOptions = createFilterOptions({ options });
    return (
      <VirtualizedSelect
        className="TopMenu--CountryDropdown"
        onChange={(selectValue) => {
          this.props.handleSetCountry(selectValue);
          this.props.handleClearGenre();
          const sweetScroll = new SweetScroll();
          console.log('scrolling down')
          const height = this.props.windowHeight - 62;
          console.log([0, this.props.windowHeight - 62]);
          sweetScroll.to(height, 0);
        }}
        options={options}
        filterOptions={filterOptions}
        value={this.props.currentCountry}
        simpleValue={true}
        disabled={false}
      />
    )
  }
}

// options:
// multi={true}

export default SelectCountry;
