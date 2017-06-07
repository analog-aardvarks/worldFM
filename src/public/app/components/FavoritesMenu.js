import React from 'react';
import store from '../index';
import { setFavorites } from '../actions';

const FavoritesMenu = ({ showFavoritesMenu, favorites, showQueueMenu, windowHeight }) => {
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
      body: JSON.stringify({ sync: true }),
    });
  };

  return (
    <div
      className="FavoritesMenu"
      style={{
        display:  showFavoritesMenu ? "block" : "none",
        height: showQueueMenu ? windowHeight - 285 - 16: windowHeight - 133 - 16,
      }}>
      <div className="FavoritesMenu__top">
        <i
          className="fa fa-info-circle fa-fw"
          onClick={() => store.dispatch({ type: 'SET_PLAYLIST', playlist: favorites })}
        />
        <span>Favorites</span>
        <div onClick={toggleSync}>
          <i className="fa fa-refresh fa-fw" />
        </div>
      </div>

      {favorites.map((track, idx) => (
          <div className="FavoritesMenu__indivdualSong" key={idx}>
              <img src={track.track_album_image} />
              <div className="FavoritesMenu__indivdualSong__songInfo">
                <span className="FavoritesMenu__SongName">{track.track_name}</span>
                <span className="FavoritesMenu__SongArtist">{JSON.parse(track.track_artist_name).join(', ')}</span>
              </div>
              <div className="FavoritesMenu__indivdualSong__actions">
                <i className="fa fa-times-circle-o fa-fw" onClick={() => removeFavorite(track)}/>
                {/*<i className="fa fa-minus fa-play fa-fw" onClick={() => removeFavorite(track)}/>*/}
              </div>
          </div>
        ))}
    </div>
  )
}

export default FavoritesMenu;
