import React from 'react';
import Song from './Song.jsx';
import Menu from './Menu.jsx';
import { PLAYLIST_HEIGHT } from '../config/dimensions';
import { PLAYLIST_WIDTH } from '../config/dimensions';

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
