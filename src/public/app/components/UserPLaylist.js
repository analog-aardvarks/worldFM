import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  showSpotifyPlaylist: state.showSpotifyPlaylist,
})

const mapDispatchToProps = (dispatch) => ({
  hideSpotifyPlaylistEvent: () => dispatch({ type: 'HIDE_SPOTIFY_PLAYLIST' }),
})

const UserPlayList = ({ showSpotifyPlaylist, hideSpotifyPlaylistEvent }) => {
  //console.log(hideSpotifyPlaylistEvent)
  return (
    <div>
      <div
        className={`SpotifyPlaylist ${showSpotifyPlaylist ? '' : 'SpotifyPlaylist--clear'}`} 
        style={{ zIndex: showSpotifyPlaylist ? 15 : -10 }}
      >
        <iframe
          src= "https://open.spotify.com/embed?uri=spotify:user:erebore:playlist:788MOXyTfcUb1tdw4oC7KJ"
          width="70%" height="400" frameBorder="0" allowTransparency="true"
        />
      </div>
      { showSpotifyPlaylist &&
      <div
        onClick={hideSpotifyPlaylistEvent}
        className="Lightbox"
        ></div>
      }
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPlayList);
