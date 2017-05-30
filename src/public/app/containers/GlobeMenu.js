import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentCountry } from '../actions';
import renderGlobe from './renderGlobe';

const mapDispatchToProps = dispatch => ({
  handleCountryClick: (country) => {
    dispatch(setCurrentCountry(country));
  },
});

class GlobeMenu extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleCountryClick = props.handleCountryClick.bind(this);
  }
  componentDidMount() {
    renderGlobe(this.container, this.props.handleCountryClick);
  }

  render() {
    return (
      <div
        ref={(el) => { this.container = el; }}
        className="globeContainer"
      />
    );
  }
}

const ConnectedGlobe = connect(mapDispatchToProps)(GlobeMenu);

export default ConnectedGlobe;
