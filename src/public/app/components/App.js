import React, { PureComponent } from 'react';
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

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      displayLanding: true,
    };

    this.showGlobe = true;
  }

  handleToggleDisplayLanding() {
    this.setState({ displayLanding: !this.state.displayLanding });
  }

  render() {
    const { displayLanding } = this.state;

    const app = displayLanding ?
      (
        <div>
          <Landing
            handleToggleDisplayLanding={() => this.handleToggleDisplayLanding()}
          />
        </div>
      ) :
      (
        <div>

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
            null
          }

        </div>
      );

    return app;
  }
}

export default App;
