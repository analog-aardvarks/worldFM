import React, { Component } from 'react';
import renderGlobe from './renderGlobe';

export default class GlobeMenu extends Component {
  componentDidMount() {
    renderGlobe(this.container);
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
