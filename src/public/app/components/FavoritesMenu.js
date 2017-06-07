import React from 'react';
import store from '../index';
import _ from 'underscore';
import { setFavorites } from '../actions';

const FavoritesMenu = ({
  showAvailableDevices,
  showFavoritesMenu,
  favorites,
  showQueueMenu,
  windowHeight,
  toggleFavoritesMenu,
  setSpotifySyncHandler,
  addTrackToSpotifyQueue,
  handleExpandClick,
  sync,
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
  // console.log(helperFuncs)
  return (
    <div
      className="FavoritesMenu"
      style={{
        display:  showFavoritesMenu ? "block" : "none",
        height: showQueueMenu || showAvailableDevices ? windowHeight - 277 - 16: windowHeight - 133,
      }}>
      <div className="FavoritesMenu__wrapper">
        <div className="FavoritesMenu__top">
          <i
            className="fa fa-trash fa-fw"
            onClick={removeAllFavorites}
            />
          <span>Favorites</span>
          <i
            className="fa fa-times fa-fw"
            onClick={toggleFavoritesMenu}
          />
        </div>

        <div className="FavoritesMenu__allSongs">
          {favorites.map((track, idx) => (
          <div className="FavoritesMenu__indivdualSong" key={idx}>
            <img src={track.track_album_image} />
            <div className="FavoritesMenu__indivdualSong__songInfo">
              <span className="FavoritesMenu__SongName">{track.track_name}</span>
              <span className="FavoritesMenu__SongArtist">{JSON.parse(track.track_artist_name).join(', ')}</span>
            </div>
            <div className="absclear">
              <div className="FavoritesMenu__hover">
                <div
                  className="FavoritesMenu__indivdualSong__Lightbox"
                  onClick={() => handleExpandClick(track)}
                />
                
                <div className="FavoritesMenu__indivdualSong__play">
                  <i className="fa fa-play fa-fw"
                    onClick={() => helperFuncs.playExternalTrack(track)}
                    style={{ marginBottom: '5px' }}/>
                  <i className="fa fa-plus fa-fw" onClick={() => addTrackToSpotifyQueue(track)}/>
                </div>

                <div className="FavoritesMenu__indivdualSong__actions">
                  <i className="fa fa-times fa-fw" onClick={() => removeFavorite(track)}/>
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
                  onChange={toggleSync}/>
                :
                <input
                  type="checkbox"
                  onChange={toggleSync}/>
                }
                <div className="slider round"/>
              </label>
            </div>
          </div>
      </div>
    </div>
  )
}

export default FavoritesMenu;
