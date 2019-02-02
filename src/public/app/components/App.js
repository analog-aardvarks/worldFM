import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'underscore'

import ConnectedGlobe from '../containers/GlobeMenu';
import HiddenPlayer from '../containers/HiddenPlayer';
import Landing from './Landing';
import Menu from '../containers/Menu';
import Player from './Player';
import Playlist from '../containers/Playlist';
import ReactTooltip from 'react-tooltip';
import '../styles/main.scss';
import Lightbox from './Lightbox';
// import About from './About';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayLanding: true,
    };

    this.handleScroll = throttle(this.handleScroll, 20);

    this.showGlobe = true;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    const { windowHeight, dispatch } = this.props
    const { scrollY } = window
    const aboveFold = scrollY < windowHeight - 100 // point at which down arrow goes above fold
    dispatch({ type: 'UPDATE_SCROLLY', scrollY, aboveFold })
  }

  handleToggleDisplayLanding() {
    this.setState({ displayLanding: !this.state.displayLanding });
  }

  render() {
    const { displayLanding } = this.state;
    const { auth } = this.props;

    const app = false && displayLanding && !auth ?
      (
        <div className="stars">
          <div className="twinkling" />
          <Landing
            handleToggleDisplayLanding={() => this.handleToggleDisplayLanding()}
          />
        </div>
      ) :
      (
        <div className="stars">
          <div className="twinkling" />
          <HiddenPlayer />
          {this.showGlobe ? <ConnectedGlobe /> : null}
          <Menu />
          <Playlist />
          <Player />
          <Lightbox />

          {window.innerWidth > 580 ?
            <div>
              <ReactTooltip
                place="top"
                type="light"
                effect="solid"
                delayShow={500}
              />
              <ReactTooltip id="globe" />
            </div> :
            null}

        </div>
      );

    return app;
  }
}

const mapStateToProps = ({ auth, aboveFold, windowHeight }) => ({
  auth,
  aboveFold,
  windowHeight,
});

export default connect(mapStateToProps, null)(App);
