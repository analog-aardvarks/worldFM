import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';

import LazyImage from './LazyImage';
import {
  addTrackToSpotifyQueue,
  setFavorites,
  setSpotifyPlayerCurrentTrack,
  setSpotifyPlayerCurrentTrackIdx,
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  showLightbox,
} from '../actions';

class Song extends React.Component {
  constructor(props) {
    super(props);

    this.addToQueue = _.throttle(this.addToQueue, 750);
    this.handleFavoritesClick = _.throttle(this.handleFavoritesClick, 750);
    this.handleFavoritesClick = this.handleFavoritesClick.bind(this);
    this.handlePlayClick = _.throttle(this.handlePlayClick, 750);
    this.updateEllapsed = this.updateEllapsed.bind(this);
  }

  componentWillMount() {
    const { ranking, setStateHelperFunc } = this.props;

    if (ranking === 1 && this.props.helperFuncs.setStateHelperFunc === undefined) {
      setStateHelperFunc('addFavorite', this.handleFavoritesClick);
    }
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

  stopInterval() {
    this.props.clearSpotifyPlayerIntervalHandler();
  }

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
    const {
      pauseSpotifyPlayerHandler,
      ranking,
      setSpotifyModeHandler,
      setSpotifyPlayerCurrentTrackHandler,
      spotifyPlayer,
      togglePreviewHandler,
      track,
    } = this.props;

    if (this.props.auth) {
      if (spotifyPlayer.currentTrack === null || spotifyPlayer.currentTrack.track_id !== track.track_id) {
        setSpotifyModeHandler('playlist');
        this.props.setSpotifyPlayerCurrentTrackIdx(ranking - 1);
        setSpotifyPlayerCurrentTrackHandler(track);
        this.playTrack(track)
          .then(() => {
            pauseSpotifyPlayerHandler(false);
            this.resetInterval();
          })
          .catch(err => console.log(err));
      } else {
        if (spotifyPlayer.isPaused) {
          this.resumeTrack()
          .then(() => {
            pauseSpotifyPlayerHandler(false);
            this.startInterval();
          })
          .catch(err => console.log(err));
        } else {
          this.pauseTrack()
          .then(() => {
            pauseSpotifyPlayerHandler(true);
            this.stopInterval();
          })
          .catch(err => console.log(err));
        }
      }
    } else {
      togglePreviewHandler(track.track_preview_url);
    }
  }

  addFavorite(track) {
    fetch('/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
      .then(res => res.json())
      .then(favs => this.props.handleFavoritesChange(favs))
      .catch(err => console.log(err));
  }

  removeFavorite(track) {
    fetch('/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
      .then(res => res.json())
      .then(favs => this.props.handleFavoritesChange(favs))
      .catch(err => console.log(err));
  }

  handleFavoritesClick(track) {
    if (this.props.favorites.some(fav => fav.track_id === track.track_id)) {
      this.removeFavorite(track);
    } else {
      this.addFavorite(track);
    }
  }

  addToQueue() {
    this.props.addTrackToSpotifyQueue(this.props.track);
  }

  render() {
    const {
      auth,
      currentSong,
      favorites,
      handleExpandClick,
      playlist,
      ranking,
      spotifyPlayer,
      track_preview_url,
      track,
    } = this.props;
  
    // TODO fix this piece of logic
    let icon = 'play';
    if (auth) {
      if (auth && spotifyPlayer.currentTrack && !spotifyPlayer.isPaused && (track.track_id === spotifyPlayer.currentTrack.track_id)) {
        icon = 'pause';
      } else if (!auth && (track_preview_url === currentSong.track_preview_url)) {
        icon = 'pause';
      } else if (spotifyPlayer.isPaused) {
        icon = 'play';
      } else if (!auth && !this.props.isPlaying) {
        icon = 'play';
      }
    } else {
      if (currentSong.src !== null && currentSong.isPlaying && track.track_preview_url === currentSong.src) {
        icon = 'pause';
      }
    }

    return (
      <div
        className="Song"
        style={{
          // backgroundImage: `url(${track.track_album_image})`,
          // backgroundSize: 'cover',
          border: icon === 'play' ? '' : '3px solid #1ed760',
        }}
      >
        <LazyImage
          className="Song__image"
          alt={`Album art for ${track.track_name}`}
          src={track.track_album_image}
        />
        <div
          className="Song__wrapper"
          style={{
            border: icon === 'play' ? '' : '3px solid #1ed760',
          }}
        >
          <i
            className={`SongHover__play-button fa fa-${icon}-circle-o fa-5x fa-fw`}
            onClick={() => this.handlePlayClick()}
          />

          <i
            className="SongHover__expand fa fa-expand fa-2x fa-fw"
            onClick={() => handleExpandClick(track, playlist)}
            data-tip="View album art"
          />

          <div className="SongHover__addAndFavorites">
            <i
              className="SongHover__add-que fa fa-plus fa-2x fa-fw"
              onClick={() => this.addToQueue()}
              data-tip="Add to queue"
              style={{
                color: (spotifyPlayer.queue.some(_track => _track.track_id === track.track_id) ? '#1ed760' : 'rgb(230, 230, 230)'),
                zIndex: auth ? 10 : -100,
              }}
            />

            <i
              className="SongHover__add-favorites fa fa-heart fa-2x fa-fw"
              onClick={() => this.handleFavoritesClick(track)}
              data-tip="Add to favorites"
              style={{
                color: (favorites.some(_track => _track.track_id === track.track_id) ? '#1ed760' : 'rgb(230, 230, 230)'),
                zIndex: auth ? 10 : -100,
              }}
            />
          </div>

          <div className="Song__container">
            <span
              className="Song__ranking"
              style={{ fontFamily: 'Permanent Marker' }}
            >
              {ranking < 10 ? `0${ranking}` : ranking}
            </span>

            <div className="Song__info">
              <span
                className="Song__name"
                data-tip={`Track name: ${track.track_name}`}
              >{
                track.track_name}
              </span>

              <span
                className="Song__artist"
                data-tip={`Artist name: ${JSON.parse(track.track_artist_name).join(', ')}`}
              >
                {JSON.parse(track.track_artist_name).join(', ')}
              </span>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  pauseSpotifyPlayerHandler: isPaused => dispatch({ type: 'PAUSE_SPOTIFY_PLAYER', isPaused }),
  setSpotifyPlayerCurrentTrackHandler: track => dispatch(setSpotifyPlayerCurrentTrack(track)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
  setSpotifyPlayerIntervalHandler: interval => dispatch(setSpotifyPlayerInterval(interval)),
  clearSpotifyPlayerIntervalHandler: () => dispatch({ type: 'CLEAR_SPOTIFY_PLAYER_INTERVAL' }),
  handleFavoritesChange: favorites => dispatch(setFavorites(favorites)),
  addTrackToSpotifyQueue: track => dispatch(addTrackToSpotifyQueue(track)),
  handleExpandClick: (track, list) => dispatch(showLightbox(track, list)),
  togglePreviewHandler: src => dispatch({ type: 'TOGGLE_PLAY', src }),
  setSpotifyPlayerCurrentTrackIdx: idx => dispatch(setSpotifyPlayerCurrentTrackIdx(idx)),
  setStateHelperFunc: (name, func) => dispatch({ type: 'SET_HELPER_FUNC', name, func}),
  setSpotifyModeHandler: mode => dispatch({ type: 'SET_SPOTIFY_MODE', mode }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Song);
