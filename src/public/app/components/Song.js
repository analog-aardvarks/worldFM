import React from 'react';

const Song = ({ size,
  track,
  ranking,
  currentSong,
  songMenu,
  openSongMenu,
  closeSongMenu,
  auth,
  spotifyPlayer,
  playSpotifyPlayer,
  pauseSpotifyPlayer,
  togglePreview,
  clearSpotifyPlayerIntervalHandler,
  setSpotifyPlayerIntervalHandler,
  resumeSpotifyPlayerHandler,
  setSpotifyPlayerEllapsedHandler,
  favorites,
  handleFavoritesChange,
  addTrackToSpotifyQueue,
  activeDevice,
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
    console.log('updateSeeker inside before SONG', e);
    e += 500;
    spotifyPlayer.$seeker.value = e;
    console.log('updateSeeker inside SONG', e);
    setSpotifyPlayerEllapsedHandler(e);
  };

  const togglePlay = () => {
    if (auth &&
        spotifyPlayer.currentTrack &&
        spotifyPlayer.currentTrack.track_id === track.track_id) {
      if (!spotifyPlayer.isPaused) {
        // pause!
        console.log('CLICK ON SONG PAUSE');
        fetch('/player/pause', { credentials: 'include' })
        .then(() => {
          clearInterval(spotifyPlayer.interval);
          clearSpotifyPlayerIntervalHandler();
          pauseSpotifyPlayer();
        })
        .catch(err => console.log(err));
      } else {
        // resume!
        console.log('CLICK ON SONG RESUME');
        fetch(`/player/play?device=${activeDevice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(spotifyPlayer.currentTrack),
        })
        .then(() => {
          console.log('CLICK ON SONG RESUME, BACK FROM /PLAY');
          resumeSpotifyPlayerHandler(track);
          fetch(`/player/seek?ms=${spotifyPlayer.ellapsed}&device=${activeDevice.id}`, { credentials: 'include' })
            .then(() => {
              console.log('CLICK ON SONG RESUME, BACK FROM /SEEK');
              fetch(`/player/volume?volume=${spotifyPlayer.volume}&device=${activeDevice.id}`, { credentials: 'include' })
                .then() // setSpotifyPlayerIntervalHandler(setInterval(updateSeeker, 500)))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      }
    } else if (!spotifyPlayer.currentTrack ||
               spotifyPlayer.currentTrack.track_id !== track.track_id) {
      // change track!
      console.log('CLICK ON SONG CHANGE');
      clearInterval(spotifyPlayer.interval);
      clearSpotifyPlayerIntervalHandler();
      playSpotifyPlayer(track, activeDevice.id);
    } else {
      // not auth!
      console.log('CLICK ON SONG PREVIEW');
      togglePreview(track.track_preview_url);
    }
  };

  const addFavorite = () => {
    fetch('/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(res => res.json())
    .then(favs => handleFavoritesChange(favs))
    .catch(err => console.log(err));
  };

  const removeFavorite = () => {
    fetch('/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(res => res.json())
    .then(favs => handleFavoritesChange(favs))
    .catch(err => console.log(err));
  };

  const handleFavoritesClick = () => {
    if (favorites.some(fav => fav.track_id === track.track_id)) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  const addToQueue = () => {
    addTrackToSpotifyQueue(track);
  };

  // console.log('ELLAPSED', spotifyPlayer.ellapsed);
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
          <div className="Song__more-info" onMouseLeave={closeSongMenu}>

            {/* <div className="Song__more-info-option"
              onClick={handleFavoritesClick}
              >
              <i className="fa fa-plus fa-lg fa-fw" />
              <span>Add to favorites</span>
            </div> */}

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

        </div> }

        <i
          className={`SongHover__play-button fa fa-${icon}-circle-o fa-5x fa-fw`}
          onClick={() => togglePlay()}
          style={{ left: ((netSize-100)/2), bottom:((netSize-70)/2) }}
        />

        <i
          className="SongHover__add-que fa fa-plus fa-2x fa-fw"
          onClick={addToQueue}
          style={{ right: ((netSize-100)/10), top:((netSize-70)/10) }}
        />

        <i
          className="SongHover__add-favorites fa fa-heart fa-2x fa-fw"
          onClick={handleFavoritesClick}
          style={{ left: ((netSize-100)/10), top:((netSize-70)/10) }}
        />

        <div className="Song__container">

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

      </div>
    </div>
  );
};
export default Song;
