import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import {
  setSpotifyPlayerVolume,
  playSpotifyPlayer,
  setSpotifyPlayerMute,
  setSpotifyPlayerSeekerEl,
  setSpotifyPlayerEllapsed } from '../actions';

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

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
  setSpotifyPlayerMute: mute => dispatch(setSpotifyPlayerMute(mute)),
  setSpotifyPlayerSeekerElHandler: el => dispatch(setSpotifyPlayerSeekerEl(el)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pausePlayer = this.pausePlayer.bind(this);
    this.changePlayerVolume = this.changePlayerVolume.bind(this);
    this.changePlayerVolumeWithThrottle = _.throttle(this.changePlayerVolume, 350);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleVolumeClick = this.handleVolumeClick.bind(this);

    this.updateSeeker = this.updateSeeker.bind(this);
    this.interval = null;
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

  // check for new currentTrack
  componentDidUpdate(prev) {
    // set seeker dom element
    if (this.props.spotifyPlayer.$seeker === null && this.$seekerInput !== undefined) {
      this.props.setSpotifyPlayerSeekerElHandler(this.$seekerInput);
    }

    // console.log('CURRENT: ', this.props.spotifyPlayer.currentTrack);
    // console.log('PREV: ', prev.spotifyPlayer.currentTrack);
    if (this.props.auth && this.props.spotifyPlayer.currentTrack) {
      if (prev.spotifyPlayer.currentTrack === null ||
        (prev.spotifyPlayer.currentTrack.track_id !==
        this.props.spotifyPlayer.currentTrack.track_id)) {
        // track change!
        // console.log('TRACK_CHANGE');
        this.$seekerInput.value = 0;
        this.props.setSpotifyPlayerEllapsedHandler(0);
        this.interval = setInterval(this.updateSeeker, 500);
      }
    }
  }

  updateSeeker() {
    let e = this.props.spotifyPlayer.ellapsed;
    e += 500;
    this.$seekerInput.value = e;
    this.props.setSpotifyPlayerEllapsedHandler(e);
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

  handleVolumeClick() {
    // console.log(this.props.spotifyPlayer.volume, this.props.spotifyPlayer.mute, this.$volumeInput.value);
    if (parseInt(this.props.spotifyPlayer.volume, 10) > 0) {
      const currentVolume = this.props.spotifyPlayer.volume;
      // mute player
      fetch('/player/volume?volume=0', { credentials: 'include' })
        .then((res) => {
          this.$volumeInput.value = '0';
          this.props.setSpotifyPlayerVolumeHandler(0);
          this.props.setSpotifyPlayerMute(currentVolume);
        })
        .catch(err => console.log(err));
    } else {
      // volume is 0
      if (this.props.spotifyPlayer.mute) {
        // restore volume
        fetch(`/player/volume?volume=${this.props.spotifyPlayer.mute}`, { credentials: 'include' })
          .then((res) => {
            this.$volumeInput.value = this.props.spotifyPlayer.mute;
            this.props.setSpotifyPlayerVolumeHandler(this.props.spotifyPlayer.mute);
            this.props.setSpotifyPlayerMute(false);
          })
          .catch(err => console.log(err));
      }
    }
  }

  render() {
    // play/pause icon for spotify player
    // console.log(this.props.spotifyPlayer.isPaused)
    const playIcon = this.props.spotifyPlayer.isPaused ? 'play' : 'pause';
    // sorry!
    const volumeIcon = this.props.spotifyPlayer.volume >= 70 ? 'up' : (this.props.spotifyPlayer.volume <= 10 ? 'off' : 'down');

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
            <i
              className={`fa fa-volume-${volumeIcon} fa-lg fa-fw`}
              onClick={this.handleVolumeClick}
            />
            <input
              ref={(el) => { this.$volumeInput = el; }}
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
        {this.props.auth && this.props.spotifyPlayer.currentTrack &&
        <div className="Player__seeker">
          <div className="Player__seeker__ellapsed">
            <span>{millisToMinutesAndSeconds(this.props.spotifyPlayer.ellapsed)}</span>
          </div>
          {/* Desktop only! */}
          <input
            defaultValue="0"
            className="Player__seeker__input"
            ref={(el) => { this.$seekerInput = el; }}
            type="range"
            min="0"
            max={this.props.spotifyPlayer.currentTrack.track_length}
            step="250"
          />
          <div className="Player__seeker__total">
            <span>{millisToMinutesAndSeconds(this.props.spotifyPlayer.currentTrack.track_length)}</span>
          </div>
        </div>
        }
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
