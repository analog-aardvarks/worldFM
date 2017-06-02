import React, { Component } from 'react';
import { connect } from 'react-redux';
import renderGlobe from './renderGlobe';
import particleConfig from '../../../../particlesjs-config.json';

const mapStateToProps = ({ windowHeight, windowWidth }) => ({
  windowHeight,
  windowWidth,
});

class GlobeMenu extends Component {

  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
  }

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

  scrollDown() {
    console.log('scrolling down')
    window.scrollTo(0, this.props.windowHeight - 62);
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
          <i className="icon fa fa-chevron-down faa-pulse animated" onClick={this.scrollDown} style={{right: (window.innerWidth/2) - 22.5}} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(GlobeMenu);
