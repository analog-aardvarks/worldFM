import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { setSpotifyPlayerVolume } from '../actions';

const mapStateToProps = state => ({
  auth: state.auth,
  spotifyPlayer: state.spotifyPlayer,
});

const mapDispatchToProps = dispatch => ({
  authUserHandler: () => dispatch({ type: 'AUTHENTICATE_USER' }),
  removeAuthHandler: () => dispatch({ type: 'REMOVE_AUTH' }),
  pauseSpotifyPlayer: () => dispatch({ type: 'PAUSE_PLAYER' }),
  setSpotifyPlayerVolumeHandler: v => dispatch(setSpotifyPlayerVolume(v)),
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pausePlayer = this.pausePlayer.bind(this);
    this.changePlayerVolume = this.changePlayerVolume.bind(this);
    this.changePlayerVolumeWithThrottle = _.throttle(this.changePlayerVolume, 350);
  }

  // check for auth
  componentWillMount() {
    fetch('/player/auth', { credentials: 'include' })
      .then((res) => {
        const auth = res.status === 200;
        if(auth) {
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
        .then(res => this.props.pauseSpotifyPlayer())
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

  render() {
    return (
      <div className="Player">
      <div className="PlayerControls">
        <div className="PlayerControlsPlay">
          <i className="fa fa fa-step-backward fa-lg fa-fw" />
          <i onClick={this.pausePlayer} className="fa fa-pause fa-2x fa-fw" />
          <i className="fa fa-step-forward fa-lg fa-fw" />
        </div>
        <div style={{ minWidth: '200px' }}>
          <i className="fa fa-volume-up fa-lg fa-fw" />
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
        </div>
        <i className="fa fa-random fa-1x fa-lg RandomButton" />
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
