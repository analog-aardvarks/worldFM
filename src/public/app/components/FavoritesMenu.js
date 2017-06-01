import React from 'react';

const FavoritesMenu = ({ showFavoritesMenu, favorites }) => {

  return (
    <div className="FavoritesMenu" style={{ display:  showFavoritesMenu ? "block" : "none" }}>
      <div className="FavoritesMenu__syncButton">
        <div>
          <span>sync with spotify</span>
          <i className="fa fa-refresh fa-lg fa-fw" />
        </div>
      </div>
      {favorites.map((track) => (
          <div className="FavoritesMenu__indivdualSong">
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
            <i className="fa fa-minus fa-lg fa-fw" />
          </div>
        ))}
    </div>
  )}

export default FavoritesMenu;
