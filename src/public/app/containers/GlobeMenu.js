import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SweetScroll from 'sweet-scroll';

import Globe from '../components/Globe';
import { setCurrentCountry } from '../actions';


const mapStateToProps = ({ windowHeight, windowWidth, aboveFold }) => ({
  windowHeight,
  windowWidth,
  aboveFold,
});

class GlobeMenu extends PureComponent {

  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
    this.state = {
      showGlobe: props.windowWidth > 800,
    };
    this.selectCountry = this.selectCountry.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const showGlobe = nextProps.windowWidth > 800; // desktop
    if (showGlobe !== this.state.showGlobe) {
      this.setState({ showGlobe });
    }
  }

  selectCountry(countryName) {
    this.props.dispatch(setCurrentCountry(countryName));
    this.scrollDown();
  } 

  scrollDown(e) {
    const sweetScroll = new SweetScroll({ duration: 500 });
    const height = this.props.windowHeight - 71;
    sweetScroll.to(height, 0);
  }

  render() {
    return this.state.showGlobe && (
      <div className="page-container">
        <Globe
          selectCountry={this.selectCountry}
          aboveFold={this.props.aboveFold}
          rotate={false}
        />
        <i
          className="icon fa fa-chevron-down faa-pulse animated"
          onClick={this.scrollDown}
          role="button"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(GlobeMenu);
