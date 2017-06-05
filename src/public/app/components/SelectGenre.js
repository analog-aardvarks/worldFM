import React, { Component } from 'react'
import VirtualizedSelect from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options';
import genres from '../constants/availableGenres';

class SelectGenre extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const options = genres.map(g => ({ value: g, label: g }));
    const filterOptions = createFilterOptions({ options });
    return (
      <VirtualizedSelect
        className="TopMenu--GenreDropdown"
        onChange={(selectValue) => {
          this.props.handleSetGenre(selectValue);
          this.props.handleClearCountry();
        }}
        options={options}
        filterOptions={filterOptions}
        value={this.props.currentGenre}
        simpleValue={true}
        disabled={false}
      />
    )
  }
}

export default SelectGenre;
