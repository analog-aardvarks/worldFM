import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

import Globe from '../components/Globe';


const mapStateToProps = ({ windowHeight, windowWidth }) => ({
  windowHeight,
  windowWidth,
});

class GlobeMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
    this.state = {
      showGlobe: props.windowWidth > 800,
    };
  }

  componentWillReceiveProps(nextProps) {
    const showGlobe = nextProps.windowWidth > 800; // desktop
    if (showGlobe !== this.state.showGlobe) {
      this.setState({ showGlobe });
    }
    // rerender globe is window size changes
    // if (showGlobe &&
    //   (nextProps.windowHeight !== this.props.windowHeight ||
    //     nextProps.windowWidth !== this.props.windowWidth)) {
    //   d3.select('.globe').remove();
    //   clearInterval(this.globe.interval);
    //   const rotation = this.globe.projection.rotate();
    //   this.globe = renderGlobe(this.container, rotation);
    // }
  }

  scrollDown(e) {
    const sweetScroll = new SweetScroll({ duration: 200 });
    const height = this.props.windowHeight - 71;
    sweetScroll.to(height, 0);
  }

  render() {
    return this.state.showGlobe && (
      <div className="page-container">
        <Globe />
        <i
          className="icon fa fa-chevron-down faa-pulse animated"
          onClick={this.scrollDown}
          style={{ right: (window.innerWidth / 2) - 22.5 }}
          role="button"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(GlobeMenu);
