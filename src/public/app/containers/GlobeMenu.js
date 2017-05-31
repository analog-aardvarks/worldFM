import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentCountry } from '../actions';
import renderGlobe from './renderGlobe';
import particleConfig from '../../../../particlesjs-config.json';

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
    particlesJS('particles', particleConfig);
  }

  render() {
    return (
      <div className="page-container">
        <div id="particles">
          <div
            ref={(el) => { this.container = el; }}
            className="globeContainer"
            style={{height: (window.innerHeight - 64)}}
          />
        </div>
      </div>
    );
  }
}

const ConnectedGlobe = connect(mapDispatchToProps)(GlobeMenu);

export default ConnectedGlobe;
