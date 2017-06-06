import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showQueueMenu: state.showQueueMenu,
  spotifyPlayer: state.spotifyPlayer,
})

const mapDispatchToProps = dispatch => ({
})

const QueueMenu = ({ showQueueMenu, toggleQueueMenu, spotifyPlayer, removeTrackFromQueue }) => {

  return (

    <div className="QueueMenu" style={{ display: showQueueMenu ? "block" : "none" }}>

      <div className="QueueMenu__topBar">
        {/* do not remove */}
        <i className="fa fa fa-thumb-tack fa-1 fa-fw" style={{ opacity: '0' }}/>
        <span>Queue</span>
        <i className="fa fa fa-times fa-1 fa-fw" onClick={toggleQueueMenu} />
      </div>

      <div className="QueueMenu__songList">
      {spotifyPlayer.queue.map((track, idx) => (
      <div className="QueueMenu__indivdualSong" key={idx}>
        {/*<div className="absclear">
          <i className="fa fa-times-circle-o fa-lg fa-fw" onClick={ () => removeTrackFromQueue(idx) }/>
        </div>*/}
        <img src={track.track_album_image} />
        <div className="QueueMenu__indivdualSong__songInfo">
          <span className="QueueMenu__songName">{track.track_name}</span>
          <span className="QueueMenu__songArtist">{JSON.parse(track.track_artist_name).join(', ')}</span>
        </div>
      </div>
      ))}
      </div>
    </div>
  )
}


export default connect(mapStateToProps, mapDispatchToProps)(QueueMenu);
