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
  addTrackToSpotifyQueue,
  setSpotifyPlayerCurrentTrackIdx,
}) => {

  window.onresize = () => onWindowResize(window.innerWidth);
  let songWidth = 0;
  let playlistWidth = showFavoritesMenu ?  windowWidth - 290 : windowWidth;
  if (playlistWidth < 500) {
    songWidth = playlistWidth / 2;
  }
  else if (playlistWidth < 800) {
    songWidth = playlistWidth / 3;
  }
  else if (playlistWidth < 1100) {
    songWidth = playlistWidth / 4;
  }
  else if (playlistWidth < 1450) {
    songWidth = playlistWidth / 5;
  }
  else  {
    songWidth = playlistWidth / 6;
  }

  return (
    <div
      className="Playlist"
      style={{
        width: playlistWidth,
      }}
    >
      {
        playlist.map((listItem, idx) => (
          <Song
            key={listItem.track_id}
            ranking={idx + 1}
            track={listItem}
            size={songWidth}
            currentSong={currentSong}
            playlist={playlist}
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
            addTrackToSpotifyQueue={addTrackToSpotifyQueue}
            setSpotifyPlayerCurrentTrackIdx={setSpotifyPlayerCurrentTrackIdx}
          />
      ))}

    </div>
  );
}

export default Songs;
