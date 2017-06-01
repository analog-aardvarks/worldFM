import React, { Component } from 'react';
import { connect } from 'react-redux';
// import 'particles.js';
import renderGlobe from './renderGlobe';
import particleConfig from '../../../../particlesjs-config.json';

const mapStateToProps = ({ windowHeight, windowWidth }) => ({
  windowHeight,
  windowWidth,
});

class GlobeMenu extends Component {

  componentDidMount() {
    particlesJS('particles', particleConfig);
    this.globeSpecs = renderGlobe(this.container, [-100, 0]);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowHeight !== this.props.windowHeight
      || nextProps.windowWidth !== this.props.windowWidth) {
      d3.select('.globe').remove();
      const rotation = this.globeSpecs.projection.rotate();
      this.globeSpecs = renderGlobe(this.container, rotation);
    }
  }

  render() {
    return (
      <div className="page-container">
        <div id="particles">
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

export default connect(mapStateToProps)(GlobeMenu);
