import React from 'react';
import Song from './Song.jsx';
import samplePlaylist from './../config/samplePlaylist.jsx';

const NAVBAR_HEIGHT = 0; // px
const PLAYER_HEIGHT = 0; // px
const PLAYLIST_HEIGHT = window.innerHeight - NAVBAR_HEIGHT - PLAYER_HEIGHT;

class Playlist extends React.Component {
  render() {
    return (
      <div
        className="Playlist"
        style={{
          height: PLAYLIST_HEIGHT
        }}
      >
        {samplePlaylist && samplePlaylist.items.map((listItem, idx) => {
          return (
            <Song
              key={listItem.track.id}
              ranking={idx + 1}
              name={listItem.track.name}
              artists={listItem.track.artists}
              album={listItem.track.album}
              size={PLAYLIST_HEIGHT / 3}
            />
          );
        })}
      </div>
    );
  }
}

export default Playlist;
