import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import {
  setSpotifyPlayerVolume,
  playSpotifyPlayer,
  setSpotifyPlayerMute,
  setSpotifyPlayerSeekerEl,
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  clearSpotifyPlayerInterval, } from '../actions';

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  spotifyPlayer: state.spotifyPlayer,
  showVolumeGauge: state.showVolumeGauge,
  showAvailableDevices: state.showAvailableDevices,
  showQueueMenu: state.showQueueMenu,
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
  resumeSpotifyPlayerHandler: track => dispatch(playSpotifyPlayer(track)),
  setSpotifyPlayerMute: mute => dispatch(setSpotifyPlayerMute(mute)),
  setSpotifyPlayerSeekerElHandler: el => dispatch(setSpotifyPlayerSeekerEl(el)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
  setSpotifyPlayerIntervalHandler: interval => dispatch(setSpotifyPlayerInterval(interval)),
  clearSpotifyPlayerIntervalHandler: () => dispatch(clearSpotifyPlayerInterval()),
  showVolumeGaugeEvent: () => dispatch({ type: 'SHOW_VOLUME_GAUGE' }),
  hideVolumeGaugeEvent: () => dispatch({ type: 'HIDE_VOLUME_GAUGE' }),
  showAvailableDevicesEvent: () => dispatch({ type: 'SHOW_AVAILABLE_DEVICES' }),
  hideAvailableDevicesEvent: () => dispatch({ type: 'HIDE_AVAILABLE_DEVICES' }),
  showQueueMenuEvent: () => dispatch({ type: 'SHOW_QUEUE_MENU' }),
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pausePlayer = this.pausePlayer.bind(this);
    this.changePlayerVolume = this.changePlayerVolume.bind(this);
    this.changePlayerVolumeWithThrottle = _.throttle(this.changePlayerVolume, 350);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleVolumeClick = this.handleVolumeClick.bind(this);
    this.handleSeekerChange = this.handleSeekerChange.bind(this);
    this.toggleVolumeDisplay = this.toggleVolumeDisplay.bind(this);
    this.toggleAvailableDevices = this.toggleAvailableDevices.bind(this);
    this.updateSeeker = this.updateSeeker.bind(this);
    this.toggleQueueMenu = this.toggleQueueMenu.bind(this);
    // this.interval = null;
  }

  // check for auth
  componentWillMount() {
    // test
    fetch('/playlist/sync', { credentials: 'include' })
      .then(res => console.log(res))
      .catch(err => console.log(err));

    fetch('/player/auth', { credentials: 'include' })
      .then((res) => {
        const auth = res.status === 200;
        if (auth) {
          this.props.authUserHandler();
          // get and set spotify volume
          fetch('/devices', { credentials: 'include' })
          .then(devicesRes => devicesRes.json())
          .then((devicesRes) => {
            devicesRes.devices.forEach((device) => {
              // console.log(device);
              if (device.is_active) {
                this.changePlayerVolume({ target: { value: device.volume_percent } });
              }
            });
          })
          .catch(err => console.log(err));
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
        this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateSeeker, 500));
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
        .then((res) => {
          // console.log(this.props.spotifyPlayer.ellapsed);
          clearInterval(this.props.spotifyPlayer.interval);
          this.props.clearSpotifyPlayerIntervalHandler();
          this.props.pauseSpotifyPlayerHandler();
        })
        .catch(err => console.log(err));
    }
  }

  changePlayerVolume(e) {
    if (this.props.auth) {
      fetch(`/player/volume?volume=${e.target.value}`, { credentials: 'include' })
        .then((res) => {
          this.$volumeInput.value = e.target.value;
          this.props.setSpotifyPlayerVolumeHandler(e.target.value);
        })
        .catch(err => console.log(err));
    }
  }

  handlePlayClick() {
    // we don't want it to break if not auth
    if (this.props.auth) {
      if (this.props.spotifyPlayer.isPaused) {
        if (this.props.spotifyPlayer.currentTrack) {
          // resume playback
          const track = this.props.spotifyPlayer.currentTrack;
          fetch('/player/play', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(track),
          })
          .then(() => {
            this.props.resumeSpotifyPlayerHandler(track);
            // seek!
            fetch(`/player/seek?ms=${this.props.spotifyPlayer.ellapsed}`, { credentials: 'include' })
              .then(res => this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateSeeker, 500)))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
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

  handleSeekerChange(e) {
    // seek!
    const ms = parseInt(e.target.value, 10);
    clearInterval(this.props.spotifyPlayer.interval);
    this.props.clearSpotifyPlayerIntervalHandler();
    // this.$volumeInput.value = ms;

    fetch(`/player/seek?ms=${ms}`, { credentials: 'include' })
      .then((res) => {
        this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateSeeker, 500));
        this.props.setSpotifyPlayerEllapsedHandler(ms);
      })
      .catch(err => console.log(err));
  }

  toggleVolumeDisplay() {
    if(this.props.showVolumeGauge) this.props.hideVolumeGaugeEvent();
    if(!this.props.showVolumeGauge) this.props.showVolumeGaugeEvent();
  }

  toggleAvailableDevices() {
    if(this.props.showAvailableDevices) this.props.hideAvailableDevicesEvent();
    if(!this.props.showAvailableDevices) this.props.showAvailableDevicesEvent();
  }

  toggleQueueMenu() {
    if(this.props.showQueueMenu) this.props.hideQueueMenuEvent();
    if(!this.props.showQueueMenu) this.props.showQueueMenuEvent();
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
              onMouseOver={this.props.showVolumeGaugeEvent}
            />
            {this.props.showVolumeGauge ? <div className="Player__volumeGauge" onMouseOver={this.props.showVolumeGaugeEvent}>
              <input
                ref={(el) => { this.$volumeInput = el; }}
                onMouseOver={this.props.showVolumeGaugeEvent}
                onMouseOut={this.props.hideVolumeGaugeEvent}
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
            </div>: null}
          </div>

          <div className="Player__devices">
            <i className="fa fa fa-mobile fa-2x fa-fw" onMouseOver={this.props.showAvailableDevicesEvent} />
              {this.props.showAvailableDevices ? <div className="Device--Selector" onMouseOver={this.props.showAvailableDevicesEvent} onMouseOut={this.props.hideAvailableDevicesEvent}>
                Devices
            </div> : null}
          </div>

          <div className="QueueMenu--toggle">
            <i className="fa fa fa-list fa-1x fa-fw" onClick={this.toggleQueueMenu}/>
          </div>

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
            onMouseUp={e => this.handleSeekerChange(e)}
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
