import React from 'react';
import { connect } from 'react-redux';
import Song from './Song';

const Playlist = props => (
  <div
    className="Playlist"
    style={{ marginBottom: props.auth ? '65px' : 0 }}
  >
    {props.playlist.map((track, idx) => (
      <Song
        key={track.track_id}
        ranking={idx + 1}
        track={track}
      />
    ))}
  </div>
);


const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  showFavoritesMenu: state.showFavoritesMenu,
  windowWidth: state.windowWidth,
});

export default connect(mapStateToProps, null)(Playlist);
