import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
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
      displayLanding: true,
    };

    this.showGlobe = true;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    console.log('scrolllll')
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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps, null)(App);
