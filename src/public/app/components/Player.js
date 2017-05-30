import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { setSpotifyPlayerVolume, playSpotifyPlayer } from '../actions';

const mapStateToProps = state => ({
  auth: state.auth,
  spotifyPlayer: state.spotifyPlayer,
  currentSong: state.currentSong,
  showVolumeGauge: state.showVolumeGauge,
  showAvailableDevices: state.showAvailableDevices,
});

let volumeDisplay = false;

const mapDispatchToProps = dispatch => ({
  authUserHandler: () => dispatch({ type: 'AUTHENTICATE_USER' }),
  playSpotifyPlayerHandler: track => dispatch(playSpotifyPlayer(track)),
  pauseSpotifyPlayerHandler: () => dispatch({ type: 'PAUSE_PLAYER' }),
  setSpotifyPlayerVolumeHandler: v => dispatch(setSpotifyPlayerVolume(v)),
  showVolumeGaugeEvent: () => dispatch({ type: 'SHOW_VOLUME_GAUGE' }),
  hideVolumeGaugeEvent: () => dispatch({ type: 'HIDE_VOLUME_GAUGE' }),
  showAvailableDevicesEvent: () => dispatch({ type: 'SHOW_AVAILABLE_DEVICES' }),
  hideAvailableDevicesEvent: () => dispatch({ type: 'HIDE_AVAILABLE_DEVICES' }),
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pausePlayer = this.pausePlayer.bind(this);
    this.changePlayerVolume = this.changePlayerVolume.bind(this);
    this.toggleVolumeDisplay = this.toggleVolumeDisplay.bind(this);
    this.toggleAvailableDevices = this.toggleAvailableDevices.bind(this);
  }

  // check for auth
  componentWillMount() {
    fetch('/player/auth', { credentials: 'include' })
      .then((res) => {
        const auth = res.status === 200;
        if (auth) {
          this.props.authUserHandler();
          this.changePlayerVolume({ target: { value: 50 } });
        } else {
          console.log('NO_AUTH');
        }
      })
      .catch(err => console.log(err));
  }

  pausePlayer() {
    if (this.props.auth) {
      fetch('/player/pause', { credentials: 'include' })
        .then(res => this.props.pauseSpotifyPlayerHandler())
        .catch(err => console.log(err));
    }
  }

  changePlayerVolume(e) {
    if (this.props.auth) {
      fetch(`/player/volume?volume=${e.target.value}`, { credentials: 'include' })
        .then(res => this.props.setSpotifyPlayerVolumeHandler(e.target.value))
        .catch(err => console.log(err));
    }
  }

  toggleVolumeDisplay() {
    if(this.props.showVolumeGauge) this.props.hideVolumeGaugeEvent();
    if(!this.props.showVolumeGauge) this.props.showVolumeGaugeEvent();
  }

  toggleAvailableDevices() {
    if(this.props.showAvailableDevices) this.props.hideAvailableDevicesEvent();
    if(!this.props.showAvailableDevices) this.props.showAvailableDevicesEvent();
  }

  render() {
    return (
      <div className="Player">
      <div className="PlayerControls">
        <div className="PlayerControlsPlay">
          <i className="fa fa fa-step-backward fa-lg fa-fw" />
          <i onClick={this.pausePlayer} className="fa fa-pause fa-2x fa-fw" />
          <i className="fa fa-step-forward fa-lg fa-fw" />
        </div>
        <div className="Player__volume">
          <i className="fa fa-volume-up fa-lg fa-fw" onClick={this.toggleVolumeDisplay} />
          {this.props.showVolumeGauge ? <div className="Player__volumeGauge">
            <input
              onChange={(e) => {
                e.persist();
                this.changePlayerVolumeWithThrottle(e);
              }}
              onMouseUp={(e) => {
                e.persist();
                this.changePlayerVolume(e);
              }}
              type="range"
              min="0"
              max="100"
            />
          </div>  : null}
        </div>
        <div className="Player__devices">
          <i className="fa fa fa-mobile fa-lg fa-fw" onClick={this.toggleAvailableDevices} />
            {this.props.showAvailableDevices ? <div className="Device--Selector">
            <span>Devices</span>
            <span>Device 1</span>
            <span>Device 2</span>
          </div> : null}
        </div>
        {/* <i className="fa fa-random fa-1x fa-lg RandomButton" /> */}
      </div>
        <div className="CurrentSong">
          <img className="CurrentSongPic" src="https://i.scdn.co/image/2b61b1d9bb5d2dadfe782cfcf1f6f0db840a5973" width = "46" height="46" />
          <div className="CurrentSongInfo">
            <span>Song Name</span>
            <span>Artist</span>
          </div>
        </div>
      </div>
    );
  }
}

Player = connect(mapStateToProps, mapDispatchToProps)(Player);
export default Player;
