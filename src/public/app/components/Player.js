import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import { setSpotifyPlayerVolume, playSpotifyPlayer } from '../actions';

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  spotifyPlayer: state.spotifyPlayer,
});

const mapDispatchToProps = dispatch => ({
  authUserHandler: () => dispatch({ type: 'AUTHENTICATE_USER' }),
  playSpotifyPlayerHandler: track => dispatch(playSpotifyPlayer(track)),
  pauseSpotifyPlayerHandler: () => dispatch({ type: 'PAUSE_SPOTIFY_PLAYER' }),
  setSpotifyPlayerVolumeHandler: v => dispatch(setSpotifyPlayerVolume(v)),
  playSpotifyPlayer: (track) => {
    fetch('/player/play', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(() => dispatch(playSpotifyPlayer(track)))
    .catch(err => console.log(err));
  },
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pausePlayer = this.pausePlayer.bind(this);
    this.changePlayerVolume = this.changePlayerVolume.bind(this);
    this.changePlayerVolumeWithThrottle = _.throttle(this.changePlayerVolume, 350);
    this.handlePlayClick = this.handlePlayClick.bind(this);
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

  handlePlayClick() {
    // we don't want it to break if not auth
    if (this.props.auth) {
      if (this.props.spotifyPlayer.isPaused) {
        if (this.props.spotifyPlayer.currentTrack) {
          // resume playback
          console.log('RESUME_PLAYBACK');
        } else {
          // play first song on playlist
          this.props.playSpotifyPlayer(this.props.playlist[0]);
        }
      } else {
        // pause
        this.pausePlayer();
      }
    }
  }

  render() {
    // play/pause icon for spotify player
    // console.log(this.props.spotifyPlayer.isPaused)
    const playIcon = this.props.spotifyPlayer.isPaused ? 'play' : 'pause';
    // const volumeIcon = this.p

    return (
      <div className="Player">
      <div className="PlayerControls">
        <div className="PlayerControlsPlay">
          <i className="fa fa fa-step-backward fa-lg fa-fw" />
          <i
            className={`fa fa-${playIcon} fa-2x fa-fw`}
            onClick={this.handlePlayClick}
          />
          <i className="fa fa-step-forward fa-lg fa-fw" />
        </div>
        <div className="Player__volume">
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
        {/* random and shuffle buttons */}
        {/* <i className="fa fa-random fa-1x fa-lg RandomButton" /> */}
      </div>
        {/* current song when authenticated */}
        {this.props.auth && this.props.spotifyPlayer.currentTrack &&
        <div className="CurrentSong">
          <img
            className="CurrentSongPic"
            alt="track_album_image"
            src={this.props.spotifyPlayer.currentTrack.track_album_image}
            width="46"
            height="46"
          />
          <div className="CurrentSongInfo">
            <span>{this.props.spotifyPlayer.currentTrack.track_name}</span>
            <span>{JSON.parse(this.props.spotifyPlayer.currentTrack.track_artist_name).join(', ')}</span>
          </div>
        </div>
        }
      </div>
    );
  }
}

Player = connect(mapStateToProps, mapDispatchToProps)(Player);
export default Player;
