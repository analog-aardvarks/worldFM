import React, { Component } from 'react';
// import 'particles.js';
import renderGlobe from './renderGlobe';
import particleConfig from '../../../../particlesjs-config.json';

export default class GlobeMenu extends Component {
  componentDidMount() {
    // particlesJS('particles-js', particleConfig, !1);
    renderGlobe(this.container);
  }

  render() {
    return (
      <div className="page-container">
        <div id="particles-js">
          <div
            ref={(el) => { this.container = el; }}
            className="globeContainer"
            style={{ height: (window.innerHeight - 64) }}
          />
        </div>
      </div>
    );
  }
}
