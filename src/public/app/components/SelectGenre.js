import React, { Component } from 'react';
// import VirtualizedSelect from 'react-virtualized-select'
// import createFilterOptions from 'react-select-fast-filter-options';
import Select from 'react-select';
import genres from '../constants/availableGenres';

class SelectGenre extends Component {
  constructor(props) {
    super(props);

    this.options = genres.map(g => ({ value: g, label: g }));
  }

  handleOnChange(newValue) {
    console.log(newValue);
    this.props.handleClearCountry();
    this.props.handleSetGenre(newValue);
  }

  render() {
    const { currentGenre } = this.props;
    // const options = genres.map(g => ({ value: g, label: g }));
    // const filterOptions = createFilterOptions({ options });

    return (
      // <VirtualizedSelect
      //   className="TopMenu--GenreDropdown"
      //   onChange={(selectValue) => {
      //     this.props.handleSetGenre(selectValue);
      //     this.props.handleClearCountry();
      //   }}
      //   options={options}
      //   filterOptions={filterOptions}
      //   value={this.props.currentGenre}
      //   simpleValue={true}
      //   disabled={false}
      // />
      <Select
        value={currentGenre}
        onChange={newValue => this.handleOnChange(newValue)}
        options={this.options}
      />
    );
  }
}

export default SelectGenre;
