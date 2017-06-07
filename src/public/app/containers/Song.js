import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import {
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  setFavorites,
  addTrackToSpotifyQueue,
  setSpotifyPlayerCurrentTrack,
  showLightbox,
  setSpotifyPlayerCurrentTrackIdx,
} from '../actions';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  pauseSpotifyPlayerHandler: isPaused => dispatch({ type: 'PAUSE_SPOTIFY_PLAYER', isPaused }),
  setSpotifyPlayerCurrentTrackHandler: track => dispatch(setSpotifyPlayerCurrentTrack(track)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
  setSpotifyPlayerIntervalHandler: interval => dispatch(setSpotifyPlayerInterval(interval)),
  clearSpotifyPlayerIntervalHandler: () => dispatch({ type: 'CLEAR_SPOTIFY_PLAYER_INTERVAL' }),
  handleFavoritesChange: favorites => dispatch(setFavorites(favorites)),
  addTrackToSpotifyQueue: track => dispatch(addTrackToSpotifyQueue(track)),
  handleExpandClick: track => dispatch(showLightbox(track)),
  togglePreviewHandler: src => dispatch({ type: 'TOGGLE_PLAY', src }),
  setSpotifyPlayerCurrentTrackIdx: idx => dispatch(setSpotifyPlayerCurrentTrackIdx(idx)),
});

class Song extends React.Component {
  constructor(props) {
    super(props);
    this.borderWidth = 3; // px
    this.updateEllapsed = this.updateEllapsed.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handlePlayClick = _.throttle(this.handlePlayClick, 750);
    this.handleFavoritesClick = this.handleFavoritesClick.bind(this);
    this.handleFavoritesClick = _.throttle(this.handleFavoritesClick, 750);
    this.addToQueue = this.addToQueue.bind(this);
    this.addToQueue = _.throttle(this.addToQueue, 750);
  }

  updateEllapsed() {
    let ellapsed = this.props.spotifyPlayer.ellapsed;
    ellapsed += 250;
    this.props.setSpotifyPlayerEllapsedHandler(ellapsed);
  }

  startInterval() {
    this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateEllapsed, 250));
  }

  resetInterval() {
    this.props.clearSpotifyPlayerIntervalHandler();
    this.props.setSpotifyPlayerEllapsedHandler(0);
    this.startInterval();
  }

  stopInterval() { this.props.clearSpotifyPlayerIntervalHandler(); }

  playTrack(trackToPlay = this.props.spotifyPlayer.currentTrack) {
    return new Promise((resolve, reject) => {
      fetch(`/player/play?device=${this.props.activeDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trackToPlay),
      })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  pauseTrack() {
    return new Promise((resolve, reject) => {
      fetch(`/player/pause?device=${this.props.activeDevice.id}`, { credentials: 'include' })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  resumeTrack(ms = this.props.spotifyPlayer.ellapsed) {
    const volume = this.props.spotifyPlayer.volume;
    return new Promise((resolve, reject) => {
      this.changeVolume(0)
      .then(() => {
        this.playTrack()
        .then(() => {
          this.seekTrack(ms)
          .then(() => {
            this.changeVolume(volume)
            .then(() => resolve())
            .catch(err => reject(err));
          })
          .catch(err => reject(err));
        })
        .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
  }

  changeVolume(volume) {
    return new Promise((resolve, reject) => {
      fetch(`/player/volume?volume=${volume}&device=${this.props.activeDevice.id}`, { credentials: 'include' })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  seekTrack(ms) {
    return new Promise((resolve, reject) => {
      fetch(`/player/seek?ms=${ms}&device=${this.props.activeDevice.id}`, { credentials: 'include' })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  handlePlayClick() {
    if (this.props.auth) {
      if (this.props.spotifyPlayer.currentTrack === null ||
          this.props.spotifyPlayer.currentTrack.track_id !== this.props.track.track_id) {
        this.props.setSpotifyPlayerCurrentTrackIdx(this.props.ranking - 1);
        this.props.setSpotifyPlayerCurrentTrackHandler(this.props.track);
        this.playTrack(this.props.track)
        .then(() => {
          this.props.pauseSpotifyPlayerHandler(false);
          this.resetInterval();
        })
        .catch(err => console.log(err));
      } else {
        if (this.props.spotifyPlayer.isPaused) {
          this.resumeTrack()
          .then(() => {
            this.props.pauseSpotifyPlayerHandler(false);
            this.startInterval();
          })
          .catch(err => console.log(err));
        } else {
          this.pauseTrack()
          .then(() => {
            this.props.pauseSpotifyPlayerHandler(true);
            this.stopInterval();
          })
          .catch(err => console.log(err));
        }
      }
    } else {
      this.props.togglePreviewHandler(this.props.track.track_preview_url);
    }
  }

  addFavorite() {
    fetch('/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(this.props.track),
    })
    .then(res => res.json())
    .then(favs => this.props.handleFavoritesChange(favs))
    .catch(err => console.log(err));
  }

  removeFavorite() {
    fetch('/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(this.props.track),
    })
    .then(res => res.json())
    .then(favs => this.props.handleFavoritesChange(favs))
    .catch(err => console.log(err));
  }

  handleFavoritesClick() {
    if (this.props.favorites.some(fav => fav.track_id === this.props.track.track_id)) {
      this.removeFavorite();
    } else this.addFavorite();
  }

  addToQueue() { this.props.addTrackToSpotifyQueue(this.props.track); }

  render() {
    this.netSize = this.props.size - this.borderWidth;
    // TODO fix this piece of logic
    let icon = 'play';
    if(this.props.auth) {
      if (this.props.auth &&
          this.props.spotifyPlayer.currentTrack &&
          !this.props.spotifyPlayer.isPaused &&
          this.props.track.track_id === this.props.spotifyPlayer.currentTrack.track_id) {
        icon = 'pause';
      } else if (!this.props.auth &&
          this.props.track_preview_url === this.props.currentSong.track_preview_url) {
        icon = 'pause';
      } else if (this.props.spotifyPlayer.isPaused) {
        icon = 'play';
      } else if (!this.props.auth && !this.props.isPlaying) {
        icon = 'play';
      }
  } else {
    if(this.props.currentSong.src !== null &&
      this.props.currentSong.isPlaying &&
      this.props.track.track_preview_url === this.props.currentSong.src) {
      icon = 'pause';
    }
  }

    return (
      <div
        className="Song"
        style={{
          backgroundImage: `url(${this.props.track.track_album_image})`,
          maxWidth: this.netSize,
          maxHeight: this.netSize,
          minWidth: this.netSize,
          minHeight: this.netSize,
          border: icon === "play" ? "" : "3px solid #1ed760",
        }}
      >
        <div
          className="Song__wrapper"
          style={{
            border: icon === "play" ? "" : "3px solid #1ed760",
            width: this.netSize - 6,
            height: this.netSize - 6,
          }}
        >
          <i
            className={`SongHover__play-button fa fa-${icon}-circle-o fa-5x fa-fw`}
            onClick={this.handlePlayClick}
            style={{ left: ((this.netSize - 100) / 2), bottom: ((this.netSize - 70) / 2) }}
          />
          <i
            className="SongHover__expand fa fa-expand fa-2x fa-fw"
            onClick={() => this.props.handleExpandClick(this.props.track)}
            style={{ left: ((this.netSize - 100) / 10), top:((this.netSize - 70) / 10) }}
            data-tip="View Album Art"
          />
          <i
            className="SongHover__add-que fa fa-plus fa-2x fa-fw"
            onClick={this.addToQueue}
            data-tip="Add To Queue"
            style={{
              right: ((this.netSize - 100) / 10),
              top: ((this.netSize - 70) / 10),
              color: (this.props.spotifyPlayer.queue.some(track => track.track_id === this.props.track.track_id) ? "#1ed760" : "rgb(230, 230, 230)")
            }}
          />
          <i
            className="SongHover__add-favorites fa fa-heart fa-2x fa-fw"
            onClick={this.handleFavoritesClick}
            data-tip="Add To Favorites"
            style={{
              right: ((this.netSize - 100) / 10) * (this.netSize < 200 ? 5 : 3.5),
              top: ((this.netSize - 70) / 10),
              color: (this.props.favorites.some(track => track.track_id === this.props.track.track_id) ? "#1ed760" : "rgb(230, 230, 230)"),
            }}
          />
          <div className="Song__container">
            <span
              className="Song__ranking"
              style={{
                fontFamily: 'Permanent Marker',
              }}
            >
            {this.props.ranking < 10 ? `0${this.props.ranking}` : this.props.ranking}
            </span>
            <div className="Song__info">
              <span className="Song__name">{this.props.track.track_name}</span>
              <span className="Song__artist">{JSON.parse(this.props.track.track_artist_name).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Song = connect(mapStateToProps, mapDispatchToProps)(Song);
export default Song;
