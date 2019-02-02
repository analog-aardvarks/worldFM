import React, { Component } from 'react';
import { connect } from 'react-redux';
import Song from './Song';

class Playlist extends Component {

  lazyLoadRefs = {}


  setRef = (node) => {
    const { props: { track: { track_id } } } = node

  }

  checkNodes = () => {
    // const { scrollY } = 
    Object.entries(this.lazyLoadRefs).forEach((key, node) => {
      // check to viewable
      // if viewable, load image and 
      
    })
  }

  render() {
    const { auth, playlist } = this.props;

    return (
      <div
        className="Playlist"
        style={{ marginBottom: auth ? '65px' : 0 }}
      >
        {playlist.map((track, idx) => (
          <Song
            key={track.track_id}
            ranking={idx + 1}
            track={track}
            ref={this.setRef}
          />
        ))}
      </div>
    );
  }
}



const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  showFavoritesMenu: state.showFavoritesMenu,
  windowWidth: state.windowWidth,
});

export default connect(mapStateToProps, null)(Playlist);
