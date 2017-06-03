import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  setFavorites,
  setSpotifyPlayerVolume,
  playSpotifyPlayer,
  setSpotifyPlayerMute,
  setSpotifyPlayerSeekerEl,
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  clearSpotifyPlayerInterval,
  setSpotifyPlayerCurrentTrackIdx,
  showLightbox,
} from '../actions';


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
  availableDevices: state.availableDevices,
  showQueueMenu: state.showQueueMenu,
  currentCountry: state.currentCountry,
  currentSong: state.currentSong,
});

const mapDispatchToProps = dispatch => ({
  authUserHandler: (favs) => {
    dispatch({ type: 'AUTHENTICATE_USER' });
    dispatch(setFavorites(favs));
    console.log('FAVS', favs);
  },
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
  setSpotifyPlayerCurrentTrackIdx: idx => dispatch(setSpotifyPlayerCurrentTrackIdx(idx)),
  handlePicClick: src => dispatch(showLightbox(src)),
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
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    // this.interval = null;
  }

  // check for auth
  componentWillMount() {
    fetch('/player/auth', { credentials: 'include' })
      .then(res => res.json())
      .then((favs) => {
        if (favs) {
          // set auth status and user favorites
          this.props.authUserHandler(favs);
          // get and set spotify volume
          fetch('/devices', { credentials: 'include' })
          .then(devicesRes => devicesRes.json())
          .then((devicesRes) => {
            devicesRes.devices.forEach((device) => {
              if (device.is_active) {
                this.props.setSpotifyPlayerVolumeHandler(device.volume_percent);
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
    // update volume if it doesn't match the state
    if (this.props.showVolumeGauge) {
      this.$volumeInput.value = this.props.spotifyPlayer.volume;
    }
    // set seeker dom element
    if (this.props.spotifyPlayer.$seeker === null && this.$seekerInput !== undefined) {
      this.props.setSpotifyPlayerSeekerElHandler(this.$seekerInput);
    }

    if (this.props.auth && this.props.spotifyPlayer.currentTrack) {
      if (prev.spotifyPlayer.currentTrack === null ||
        (prev.spotifyPlayer.currentTrack.track_id !==
        this.props.spotifyPlayer.currentTrack.track_id)) {
        // track change!
        this.$seekerInput.value = 0;
        this.props.setSpotifyPlayerEllapsedHandler(0);
        this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateSeeker, 500));
      }
    }
    if (this.props.playlist !== prev.playlist) ReactTooltip.rebuild();
  }

  updateSeeker() {
    let e = this.props.spotifyPlayer.ellapsed;
    if (e >= this.props.spotifyPlayer.currentTrack.track_length - 500) {
      console.log('song ended');
      clearInterval(this.props.spotifyPlayer.interval);
      this.props.clearSpotifyPlayerIntervalHandler();
      this.props.setSpotifyPlayerEllapsedHandler(0);
      this.$seekerInput.value = 0;
      console.log('current song idx', this.props.spotifyPlayer.currentTrackIdx);
      if(this.props.playlist[this.props.spotifyPlayer.currentTrackIdx + 1]) {
        this.props.playSpotifyPlayer(this.props.playlist[this.props.spotifyPlayer.currentTrackIdx + 1]);
        this.props.setSpotifyPlayerCurrentTrackIdx(this.props.spotifyPlayer.currentTrackIdx + 1);
      }
    } else {
      e += 500;
      this.$seekerInput.value = e;
      this.props.setSpotifyPlayerEllapsedHandler(e);
    }
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
          this.props.setSpotifyPlayerCurrentTrackIdx(0);
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

  handlePreviousClick() {
    if (this.props.playlist[this.props.spotifyPlayer.currentTrackIdx - 1]) {
      clearInterval(this.props.spotifyPlayer.interval);
      this.props.clearSpotifyPlayerIntervalHandler();
      this.props.setSpotifyPlayerEllapsedHandler(0);
      this.props.playSpotifyPlayer(this.props.playlist[this.props.spotifyPlayer.currentTrackIdx - 1]);
      this.props.setSpotifyPlayerCurrentTrackIdx(this.props.spotifyPlayer.currentTrackIdx - 1);
    }
  }

  handleNextClick() {
    if (this.props.playlist[this.props.spotifyPlayer.currentTrackIdx + 1]) {
      clearInterval(this.props.spotifyPlayer.interval);
      this.props.clearSpotifyPlayerIntervalHandler();
      this.props.setSpotifyPlayerEllapsedHandler(0);
      this.props.playSpotifyPlayer(this.props.playlist[this.props.spotifyPlayer.currentTrackIdx + 1]);
      this.props.setSpotifyPlayerCurrentTrackIdx(this.props.spotifyPlayer.currentTrackIdx + 1);
    }
  }

  toggleVolumeDisplay() {
    if (this.props.showVolumeGauge) this.props.hideVolumeGaugeEvent();
    if (!this.props.showVolumeGauge) this.props.showVolumeGaugeEvent();
  }

  toggleAvailableDevices() {
    if (this.props.showAvailableDevices) this.props.hideAvailableDevicesEvent();
    if (!this.props.showAvailableDevices) this.props.showAvailableDevicesEvent();
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

    const deviceIcon = function(type) {
      if(type === 'Computer') {
        return 'laptop';
      }
      if(type === 'Smartphone') {
        return 'mobile';
      }
      else {
        return 'cog';
      }
    }

    return (
      <div className="Player">

        <div className="PlayerControls">

          <div className="PlayerControlsPlay">
            <span
              className="fa fa fa-futbol-o fa-2x fa-fw"
              style={{ color: 'rgb(255,0,255)' }}
              onClick={() => {
                if (this.props.auth) {
                  console.log(this.props.currentCountry);
                  fetch('/playlist/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                      country: this.props.currentCountry,
                      tracks: this.props.playlist,
                    }),
                  })
                  .then(res => console.log(res))
                  .catch(err => console.log(err));
                }
              }
            }
          />
            <i className="fa fa fa-step-backward fa-lg fa-fw" onClick={this.handlePreviousClick}/>
            <i
              className={`fa fa-${playIcon} fa-2x fa-fw`}
              onClick={this.handlePlayClick}
            />
            <i className="fa fa-step-forward fa-lg fa-fw" onClick={this.handleNextClick}/>

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

            {this.props.showAvailableDevices ? <div className="Device__selector">
              <div className="Player__devicesTitle">Devices</div>
              <i className="fa fa fa-times fa-1 fa-fw" onClick={this.toggleAvailableDevices} />
                {this.props.availableDevices.map((device, idx) => (
                  <div className="Player__devicesDevice" key={idx}>
                    <i className={`fa fa-${deviceIcon(device.type)} fa-2x fa-fw`} />
                    <span>{device.name}</span>
                  </div>
                ))}
            </div> : null}

            <div className="Player__devicesToggle">
              <i className="fa fa fa-mobile fa-1x fa-fw" onClick={this.toggleAvailableDevices} />
              <span>devices</span>
            </div>

            <div className="QueueMenu--toggle">
              <i className="fa fa fa-list fa-1x fa-fw" onClick={this.toggleQueueMenu}/>
              <span>que</span>
            </div>

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
            onClick={() => {
              this.props.handlePicClick(this.props.spotifyPlayer.currentTrack.track_album_image);
            }}
          />
          <div className="CurrentSongInfo">
            <span>{this.props.spotifyPlayer.currentTrack.track_name}</span>
            <span>{JSON.parse(this.props.spotifyPlayer.currentTrack.track_artist_name).join(', ')}</span>
          </div>
          <div className="Player__likeButton">
            <i className="fa fa fa-heart fa-lg fa-fw" />
          </div>
        </div>
        }

      </div>
    );
  }
}

Player = connect(mapStateToProps, mapDispatchToProps)(Player);
export default Player;
