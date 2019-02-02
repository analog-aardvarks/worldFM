import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'underscore';

import ConnectedGlobe from '../containers/GlobeMenu';
import HiddenPlayer from '../containers/HiddenPlayer';
import Landing from './Landing';
import Menu from '../containers/Menu';
import Player from './Player';
import Playlist from '../containers/Playlist';
import ReactTooltip from 'react-tooltip';
import '../styles/main.scss';
import Lightbox from './Lightbox';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayLanding: true,
    };

    this.handleScroll = throttle(this.handleScroll, 20);
  }

  componentWillMount() {
    this.getUserInfo();
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.handleScroll);
  }

  getUserInfo() {
    const { authUserHandler } = this.props;

    fetch('/user/info', { credentials: 'include' })
      .then((res) => {
        if (res.status === 200) {
          authUserHandler(true);
          this.handleToggleDisplayLanding();
        } else {
          authUserHandler(false);
        }
      })
      .catch(err => console.log(err));
  }

  handleScroll() {
    const { updateAboveFold, windowHeight } = this.props;
    const aboveFold = window.scrollY < windowHeight - 100;

    if (aboveFold !== this.props.aboveFold) {
      updateAboveFold(aboveFold);
    }
  }

  handleToggleDisplayLanding() {
    this.setState({ displayLanding: !this.state.displayLanding });
  }

  render() {
    const { displayLanding } = this.state;
    const { auth } = this.props;

    let app = (
      <div className="stars">
        {/* <div className="twinkling" /> */}
      </div>
    );

    if (auth === false && displayLanding) {
      app = (
        <div className="stars">
          {/* <div className="twinkling" /> */}
          <Landing
            handleToggleDisplayLanding={() => this.handleToggleDisplayLanding()}
          />
        </div>
      );
    }
    if (!displayLanding) {
      app = (
        <div className="stars">
          {/* <div className="twinkling" /> */}
          <HiddenPlayer />
          <ConnectedGlobe />
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
    }

    return app;
  }
}

const mapStateToProps = ({ auth, aboveFold, windowHeight }) => ({
  auth,
  aboveFold,
  windowHeight,
});

const mapDispatchToProps = dispatch => ({
  authUserHandler: bool => dispatch({ type: 'AUTHENTICATE_USER', payload: bool }),
  updateAboveFold: aboveFold => dispatch({ type: 'UPDATE_ABOVE_FOLD', value: aboveFold }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
