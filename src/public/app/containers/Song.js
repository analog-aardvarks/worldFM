import React from 'react';
import { connect } from 'react-redux';
import {
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  setFavorites,
  addTrackToSpotifyQueue,
  setSpotifyPlayerCurrentTrack,
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
});

class Song extends React.Component {
  constructor(props) {
    super(props);
    this.borderWidth = 3; // px
    this.netSize = this.props.size - this.borderWidth;
    this.updateEllapsed = this.updateEllapsed.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleFavoritesClick = this.handleFavoritesClick.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
  }

  updateEllapsed() {
    let ellapsed = this.props.spotifyPlayer.ellapsed;
    ellapsed += 500;
    this.props.setSpotifyPlayerEllapsedHandler(ellapsed);
  }

  startInterval() {
    this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateEllapsed, 500));
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
    return new Promise((resolve, reject) => {
      this.playTrack()
      .then(() => {
        this.seekTrack(ms)
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
      })
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
      this.togglePreview(this.props.track.track_preview_url);
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

  addToQueue() { this.addTrackToSpotifyQueue(this.props.track); }

  render() {
    let icon = 'play';
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
    }

    return (
      <div
        className="Song"
        style={{
          backgroundImage: `url(${this.props.track.track_album_image})`,
          width: this.netSize,
          height: this.netSize,
        }}
      >
        <div className="Song__wrapper">
          <i
            className={`SongHover__play-button fa fa-${icon}-circle-o fa-5x fa-fw`}
            onClick={this.handlePlayClick}
            style={{ left: ((this.netSize - 100) / 2), bottom: ((this.netSize - 70) / 2) }}
          />
          <i
            className="SongHover__add-que fa fa-plus fa-2x fa-fw"
            onClick={this.addToQueue}
            style={{ right: ((this.netSize - 100) / 10), top: ((this.netSize - 70) / 10) }}
          />
          <i
            className="SongHover__add-this.props.favorites fa fa-heart fa-2x fa-fw"
            onClick={this.handleFavoritesClick}
            style={{ left: ((this.netSize - 100) / 10), top: ((this.netSize - 70) / 10) }}
          />
          <div className="Song__container">
            <span className="Song__this.props.ranking">{this.props.ranking < 10 ? `0${this.props.ranking}` : this.props.ranking}</span>
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
