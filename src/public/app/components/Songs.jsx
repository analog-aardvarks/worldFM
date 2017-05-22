import React from 'react';
import Song from './Song.jsx';
import Menu from './Menu.jsx';
import { PLAYLIST_HEIGHT } from '../config/dimensions';

const Songs = ({ playlist, onClick }) => (
  <div
    className="Playlist"
    style={{
      height: PLAYLIST_HEIGHT,
    }}
  >
    {
      playlist.map((listItem, idx) => (
      <Song
        key={listItem.track_id}
        ranking={idx + 1}
        track={listItem}
        size={PLAYLIST_HEIGHT / 3}
        onClick={onClick}
      />
    ))}

  </div>
);

export default Songs;
