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
// import About from './About';
import Lightbox from './Lightbox';
import Particles from './Particles';


class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayLanding: !true,
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
    const aboveFold = window.scrollY <= windowHeight - 65 // menu height === 65px
    if (aboveFold !== this.props.aboveFold) {
      dispatch({ type: 'UPDATE_ABOVE_FOLD', value: aboveFold })
    }
  }

  handleToggleDisplayLanding() {
    this.setState({ displayLanding: !this.state.displayLanding });
  }

  render() {
    const { displayLanding } = this.state;
    const { auth } = this.props;

    const app = displayLanding && !auth ?
      (
        <div>
          <Particles />
          <Landing
            handleToggleDisplayLanding={() => this.handleToggleDisplayLanding()}
          />
        </div>
      ) :
      (
        <div>
          <Particles />
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
