import React from 'react';
import store from '../index';
import _ from 'underscore';
import { setFavorites } from '../actions';

const FavoritesMenu = ({
  spotifyPlayer,
  showAvailableDevices,
  showFavoritesMenu,
  showPlayerMobileOptions,
  favorites,
  showQueueMenu,
  windowHeight,
  toggleFavoritesMenu,
  setSpotifySyncHandler,
  addTrackToSpotifyQueue,
  handleExpandClick,
  sync,
  setSpotifyModeHandler,
  helperFuncs }) => {

  const removeFavorite = (track) => {
    fetch('/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(res => res.json())
    .then(favs => store.dispatch(setFavorites(favs)))
    .catch(err => console.log(err));
  };

  const toggleSync = () => {
    fetch('/sync', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sync: !sync }),
    })
    .then(res => res.json())
    .then(res => setSpotifySyncHandler(res))
    .catch(err => console.log(err));
  };
  // toggleSync = _.throttle(toggleSync, 1000);

  const removeAllFavorites = () => {
    fetch('/favorites/deleteAll', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    .then(() => store.dispatch(setFavorites([])))
    .catch(err => console.log(err));
  }

  const isActive = (idx) => spotifyPlayer.mode === 'favs' && spotifyPlayer.currentTrackIdx === idx;

  return (
    <div
      className="FavoritesMenu"
      style={{
        display:  showFavoritesMenu ? "block" : "none",
        height: showQueueMenu || showAvailableDevices || showPlayerMobileOptions ? windowHeight - 277 - 16 - 13: windowHeight - 133 - 13,
      }}>
      <div className="FavoritesMenu__wrapper">
        <div className="FavoritesMenu__top">
          <i
            className="fa fa-trash fa-fw"
            onClick={removeAllFavorites}
            data-tip="Remove all tracks from favorites"
            />
          <span>Favorites</span>
          <i
            className="fa fa-times fa-fw"
            onClick={toggleFavoritesMenu}
          />
        </div>

        <div className="FavoritesMenu__allSongs">
          {favorites.map((track, idx) => (
          <div className={`FavoritesMenu__indivdualSong ${isActive(idx) ? 'FavoritesMenu__indivdualSong--selected' : ''}`} key={idx}>
            <img src={track.track_album_image} />
            <div className="FavoritesMenu__indivdualSong__songInfo">
              <span
                className={`FavoritesMenu__songName ${isActive(idx) ? 'FavoritesMenu__songName--selected' : ''}`}
                data-tip={`Track name: ${track.track_name}`}
              >{track.track_name}</span>
              <span
                className="FavoritesMenu__SongArtist"
                data-tip={`Artists name: ${JSON.parse(track.track_artist_name).join(', ')}`}
              >{JSON.parse(track.track_artist_name).join(', ')}</span>
            </div>
            <div className="absclear">
              <div className="FavoritesMenu__hover">
                <div className="FavoritesMenu__indivdualSong__Lightbox">
                  <i
                    className="FavoritesMenu__expand fa fa-expand fa-fw"
                    onClick={() => handleExpandClick(track, favorites)}
                    data-tip="View album art"
                  />
                  <i
                    className="FavoritesMenu__close fa fa-times fa-fw"
                    onClick={() => removeFavorite(track)}
                    data-tip="Remove this track from favorites"
                  />
                  <div className="FavoritesMenu__indivdualSong__play">
                    <i className="fa fa-play fa-fw" onClick={() => helperFuncs.playExternalTrack(track, 'favs', idx)}/>
                    <i
                      className="fa fa-plus fa-fw"
                      onClick={() => addTrackToSpotifyQueue(track)}
                      data-tip="Add track to queue"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>

          <div className="FavoritesMenu__sync">
            <span>Sync with Spotify</span>
            <div className="FavoritesMenu__slider">
              <label className="switch">
                {sync === 1 ?
                <input
                  checked
                  type="checkbox"
                  onChange={toggleSync}
                  data-tip="Sync favorites with your World FM Spotify playlist"
                />
                :
                <input
                  type="checkbox"
                  onChange={toggleSync}
                  data-tip="Sync favorites with your World FM Spotify playlist"
                />
                }
                <div className="slider round" data-tip="Save your favorites to a custom Spotify playlist"/>
              </label>
            </div>
          </div>
      </div>
    </div>
  )
}

export default FavoritesMenu;
