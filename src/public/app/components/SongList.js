import React from 'react';
import Song from './Song';
import Menu from './Menu';

const NAVBAR_HEIGHT = 60; // px
const PLAYER_HEIGHT = 0; // px
const PLAYLIST_HEIGHT = window.innerHeight - NAVBAR_HEIGHT - PLAYER_HEIGHT;
const PLAYLIST_WIDTH = window.innerWidth;

const Songs = ({ playlist, onClick }) => {
  let width = 0;
  if (PLAYLIST_WIDTH < 500) {
    width = PLAYLIST_WIDTH / 2;
  }
  else if (PLAYLIST_WIDTH < 800) {
    width = PLAYLIST_WIDTH / 3;
  }
  else if (PLAYLIST_WIDTH < 1100) {
    width = PLAYLIST_WIDTH / 4;
  }
  else if (PLAYLIST_WIDTH < 1450) {
    width = PLAYLIST_WIDTH / 5;
  }
  else  {
    width = PLAYLIST_WIDTH / 6;
  }

  return (
    <div
      className="Playlist"
      style={{
        // height: PLAYLIST_HEIGHT,
        width: PLAYLIST_WIDTH,
      }}
    >
      {
        playlist.map((listItem, idx) => (
        <Song
          key={listItem.track_id}
          ranking={idx + 1}
          track={listItem}
          size={width}
          onClick={onClick}
        />
      ))}

    </div>
  );
}

export default Songs;
