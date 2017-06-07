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
        height: showQueueMenu ? windowHeight - 260 : windowHeight - 124,
      }}>
      <i
        className="fa fa-info-circle fa-lg fa-fw"
        onClick={() => store.dispatch({ type: 'SET_PLAYLIST', playlist: favorites })}
      />
      <div className="FavoritesMenu__syncButton">
        <div onClick={toggleSync}>
          <span>sync with spotify</span>
          <i className="fa fa-refresh fa-lg fa-fw" />
        </div>
      </div>
      {favorites.map((track, idx) => (
          <div className="FavoritesMenu__indivdualSong" key={idx}>
            <div className="FavoritesMenu__indivdualSong__songInfoAndPicture">
              <img
                src={track.track_album_image}
                width="46"
                height="46"
              />
              <div className="FavoritesMenu__indivdualSong__songInfo">
                <span className="FavoritesMenu__SongName">{track.track_name}</span>
                <span className="FavoritesMenu__SongArtist">{JSON.parse(track.track_artist_name).join(', ')}</span>
              </div>
            </div>
            <i className="fa fa-minus fa-lg fa-fw" onClick={() => removeFavorite(track)}/>
          </div>
        ))}
    </div>
  )
}

export default FavoritesMenu;
