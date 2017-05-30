import React from 'react';

const Song = ({ size,
  track,
  ranking,
  currentSong,
  howTrackInfo,
  songMenu,
  openSongMenu,
  closeSongMenu,
  showTrackInfo,
  auth,
  spotifyPlayer,
  playSpotifyPlayer,
  pauseSpotifyPlayer,
  togglePreview,
  clearSpotifyPlayerIntervalHandler,
  setSpotifyPlayerIntervalHandler,
  resumeSpotifyPlayerHandler,
  setSpotifyPlayerEllapsedHandler,
}) => {
  const borderWidth = 3; // px
  const netSize = size - borderWidth;

  // define icon for album image
  let icon = currentSong.isPlaying && track.track_preview_url === currentSong.track_preview_url ? 'pause' : 'play';
  if (auth && spotifyPlayer.currentTrack) {
    // asigning icon
    // console.log(spotifyPlayer.isPaused, track.track_id, spotifyPlayer.currentTrack);
    icon = !spotifyPlayer.isPaused && track.track_id === spotifyPlayer.currentTrack.track_id ? 'pause' : 'play';
  } else {
    icon = 'play';
  }

  const toggleSongMenu = () => {
    if (ranking === songMenu) {
      closeSongMenu();
    } else {
      openSongMenu(ranking);
    }
  };

  const updateSeeker = () => {
    let e = spotifyPlayer.ellapsed;
    e += 500;
    spotifyPlayer.$seeker.value = e;
    setSpotifyPlayerEllapsedHandler(e);
  };

  const togglePlay = () => {
    // console.log(spotifyPlayer.currentTrack.track_id, track.track_id)
    if (auth) {
      if (!spotifyPlayer.isPaused && spotifyPlayer.currentTrack.track_id === track.track_id) {
        clearInterval(spotifyPlayer.interval);
        clearSpotifyPlayerIntervalHandler();
        pauseSpotifyPlayer();
      } else if (spotifyPlayer.currentTrack && spotifyPlayer.isPaused && spotifyPlayer.currentTrack.track_id === track.track_id) {
        // resume!
        fetch('/player/play', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(track),
        })
        .then(() => {
          resumeSpotifyPlayerHandler(track);
          // seek!
          fetch(`/player/seek?ms=${spotifyPlayer.ellapsed}`, { credentials: 'include' })
            .then(res => setSpotifyPlayerIntervalHandler(setInterval(updateSeeker, 500)))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      } else {
        // change track!
        clearInterval(spotifyPlayer.interval);
        clearSpotifyPlayerIntervalHandler();
        playSpotifyPlayer(track);
      }
    } else {
      togglePreview(track.track_preview_url);
    }
  }
  return (
    <div
      className={`Song ${ranking === songMenu ? 'Song--green-border' : ''}`}

      style={{
        backgroundImage: `url(${track.track_album_image})`,
        width: netSize,
        height: netSize,
      }}
    >

      <div className="Song__wrapper">
        { ranking === songMenu &&
        <div className="Song__more-info-wrapper">
          <div className="Song__more-info">
            <div className="Song__more-info-option">
              <i className="fa fa-plus fa-lg fa-fw" />
              <span>Add Track</span>
            </div>
            <div className="Song__more-info-option">
              <i className="fa fa-info-circle fa-lg fa-fw" />
              <span>Album</span>
            </div>
            <div className="Song__more-info-option">
              <i className="fa fa-user-circle fa-lg fa-fw" />
              <span>Artist</span>
            </div>
            <div className="Song__more-info-option">
              <i className="fa fa-share-alt fa-lg fa-fw" />
              <span>Share Track</span>
            </div>
            <div className="Song__more-info-option">
              <i className="fa fa-music fa-lg fa-fw" />
              <span>More Like This</span>
            </div>
          </div>
        </div>
        }

        { showTrackInfo &&
        <div
          className="Song__container"
          style={{ opacity: showTrackInfo ? 1 : 0 }}
        >
          <span className="Song__ranking">{ranking < 10 ? `0${ranking}` : ranking}</span>
          <div className="Song__info">
            <span className="Song__name">{track.track_name}</span>
            <span className="Song__artist">{JSON.parse(track.track_artist_name).join(', ')}</span>
          </div>
          <span className="Song__expand">
            <i
              className={`fa fa-chevron-circle-${songMenu === ranking ? 'down' : 'up'} fa-2x fa-fw`}
              onClick={toggleSongMenu}
            />
          </span>
        </div>
        }

      </div>

      {ranking !== songMenu &&
      <div
        className="SongHover"
        style={{ bottom: netSize - (2 * borderWidth) }}
      >
        <i
          className={`SongHover__play-button fa fa-${icon}-circle-o fa-5x fa-fw`}
          onClick={() => togglePlay()}
        />
      </div>
      }
    </div>
  );
};
export default Song;
