import React from 'react';
import Song from './Song';
import Menu from '../containers/Menu';

const Songs = ({
  playlist,
  togglePreview,
  windowWidth,
  onWindowResize,
  currentSong,
  showTrackInfo,
  songMenu,
  openSongMenu,
  closeSongMenu,
  playSpotifyPlayer,
  pauseSpotifyPlayer,
  auth,
  spotifyPlayer,
  clearSpotifyPlayerIntervalHandler,
  resumeSpotifyPlayerHandler,
  setSpotifyPlayerIntervalHandler,
  setSpotifyPlayerEllapsedHandler,
  favorites,
  handleFavoritesChange,
  showFavoritesMenu,
}) => {

  window.onresize = () => onWindowResize(window.innerWidth);



  let width = 0;

  if (windowWidth < 500) {
    width = windowWidth / 2;
  }
  else if (windowWidth < 800) {
    width = windowWidth / 3;
  }
  else if (windowWidth < 1100) {
    width = windowWidth / 4;
  }
  else if (windowWidth < 1450) {
    width = windowWidth / 5;
  }
  else  {
    width = windowWidth / 6;
  }



  return (
    <div
      className="Playlist"
      style={{
        width: showFavoritesMenu ?  windowWidth - 260 : windowWidth,
      }}
    >
      {
        playlist.map((listItem, idx) => (
          <Song
            key={listItem.track_id}
            ranking={idx + 1}
            track={listItem}
            size={width}
            currentSong={currentSong}
            showTrackInfo={showTrackInfo}
            songMenu={songMenu}
            openSongMenu={openSongMenu}
            closeSongMenu={closeSongMenu}
            auth={auth}
            spotifyPlayer={spotifyPlayer}
            playSpotifyPlayer={playSpotifyPlayer}
            pauseSpotifyPlayer={pauseSpotifyPlayer}
            togglePreview={togglePreview}
            clearSpotifyPlayerIntervalHandler={clearSpotifyPlayerIntervalHandler}
            resumeSpotifyPlayerHandler={resumeSpotifyPlayerHandler}
            setSpotifyPlayerIntervalHandler={setSpotifyPlayerIntervalHandler}
            setSpotifyPlayerEllapsedHandler={setSpotifyPlayerEllapsedHandler}
            handleFavoritesChange={handleFavoritesChange}
            favorites={favorites}
          />
      ))}

    </div>
  );
}

export default Songs;
