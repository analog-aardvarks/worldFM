import React, { PureComponent } from 'react'

import renderGlobe from '../containers/renderGlobe'

import topoJSON from '../../assets/topoJSON'
import countrieNames from '../../assets/countryNames'

class Globe extends PureComponent {
  componentDidMount() {
    // Initiate spin, set event listeners
    this.globe = renderGlobe(this.container, [-100, 0]);
  }

  componentWillUnmount() {
    // cleanup, remove listeners
  }

  setupGlobe() {
    // initialize d3 code
  }

  updateGlobe() {
    // animation stuff
  }

  setRef = (node) => {
    this.container = node
  }

  render() {
    return (
    <div
      className="globeContainer"
      ref={this.setRef}
    />
    );
  }
}

export default Globe;
