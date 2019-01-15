import React, { Component } from 'react';
import Select from 'react-select';
import genres from '../constants/availableGenres';

class SelectGenre extends Component {
  constructor(props) {
    super(props);

    this.options = genres.map(genre => ({ value: genre, label: genre }));
  }

  handleOnChange(option) {
    this.props.handleClearCountry();
    this.props.handleSetGenre(option.value);
  }

  render() {
    return (
      <Select
        className="TopMenu--GenreDropdown"
        onChange={option => this.handleOnChange(option)}
        options={this.options}
      />
    );
  }
}

export default SelectGenre;
