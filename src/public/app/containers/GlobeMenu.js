import React, { Component } from 'react';
import { connect } from 'react-redux';
import renderGlobe from './renderGlobe';
import particleConfig from '../../../../particlesjs-config.json';
import SweetScroll from 'sweet-scroll';

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
    const sweetScroll = new SweetScroll();
    console.log('scrolling down')
    const height = this.props.windowHeight - 62;
    console.log([0, this.props.windowHeight - 62]);
    sweetScroll.to(height, 0);
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
