import React from 'react';
import { connect } from 'react-redux';

import { setWindowWidth } from '../actions';
import Song from './Song';

const mapStateToProps = state => ({
  playlist: state.playlist,
  favoritesmenu: state.favoritesmenu,
  windowWidth: state.windowWidth,
});

const mapDispatchToProps = dispatch => ({
  onWindowResize: () => dispatch(setWindowWidth()),
});

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    window.onresize = () => this.props.onWindowResize();
    this.songWidth = 0;
    this.playlistWidth =
      this.props.showFavoritesMenu ?
      this.props.windowWidth - 290 :
      this.props.windowWidth;
    if (this.playlistWidth < 500) this.songWidth = this.playlistWidth / 2;
    else if (this.playlistWidth < 800) this.songWidth = this.playlistWidth / 3;
    else if (this.playlistWidth < 1100) this.songWidth = this.playlistWidth / 4;
    else if (this.playlistWidth < 1450) this.songWidth = this.playlistWidth / 5;
    else this.songWidth = this.playlistWidth / 6;
  }

  render() {
    return (
      <div
        className="Playlist"
        style={{ width: this.playlistWidth }}
      >
        {this.props.playlist.map((track, idx) => (
          <Song
            key={track.track_id}
            ranking={idx + 1}
            track={track}
            size={this.songWidth}
          />
        ))}
      </div>
    );
  }
}

Playlist = connect(mapStateToProps, mapDispatchToProps)(Playlist);

export default Playlist;
