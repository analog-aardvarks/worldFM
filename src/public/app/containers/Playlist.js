import React from 'react';
import { connect } from 'react-redux';

import { setWindowSize } from '../actions';
import Song from './Song';

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  showFavoritesMenu: state.showFavoritesMenu,
  windowWidth: state.windowWidth,
});

const mapDispatchToProps = dispatch => ({
  onWindowResize: () => dispatch(setWindowSize()),
});

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    window.onresize = () => this.props.onWindowResize();
  }

  render() {
    this.songWidth = 0;
    this.playlistWidth = this.props.showFavoritesMenu && this.props.windowWidth > 580 ?
      this.props.windowWidth - 350 :
      this.props.windowWidth;
    if (this.playlistWidth < 500) this.songWidth = this.playlistWidth / 2;
    else if (this.playlistWidth < 800) this.songWidth = this.playlistWidth / 3;
    else if (this.playlistWidth < 1100) this.songWidth = this.playlistWidth / 4;
    else if (this.playlistWidth < 1450) this.songWidth = this.playlistWidth / 5;
    else this.songWidth = this.playlistWidth / 6;

    return (
      <div
        className="Playlist"
        style={{
          width: this.playlistWidth,
          marginBottom: this.props.auth ? '65px' : 0
        }}
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
