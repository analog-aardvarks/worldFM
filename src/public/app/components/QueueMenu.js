import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showQueueMenu: state.showQueueMenu,
  spotifyPlayer: state.spotifyPlayer,
  helperFuncs: state.helperFuncs,
})

const mapDispatchToProps = dispatch => ({
  removeAllFromQueue: () => dispatch({ type: 'REMOVE_ALL_FROM_SPOTIFY_QUEUE' }),
})

const QueueMenu = ({
  showQueueMenu,
  toggleQueueMenu,
  spotifyPlayer,
  removeTrackFromQueue,
  removeAllFromQueue,
  helperFuncs,
  setSpotifyModeHandler,
  handleExpandClick }) => {

  const isActive = (idx) => spotifyPlayer.mode === 'queue' && spotifyPlayer.currentTrackIdx === idx;

  return (

    <div className="QueueMenu" style={{ display: showQueueMenu ? "block" : "none" }}>

      <div className="QueueMenu__topBar">
        {/* do not remove */}
        <i
          className="fa fa-trash fa-fw"
          onClick={removeAllFromQueue}
          data-tip="Remove all tracks from queue"/>
        <span>Queue</span>
        <i className="fa fa fa-times fa-1 fa-fw" onClick={toggleQueueMenu} />
      </div>

      <div className="QueueMenu__songList">
      {spotifyPlayer.queue.map((track, idx) => (
      <div
        className={`QueueMenu__indivdualSong ${isActive(idx) ? 'QueueMenu__indivdualSong--selected' : ''}`}
        key={idx}
      >

        <img src={track.track_album_image} />

        <div className="QueueMenu__indivdualSong__songInfo">
          <span className={`QueueMenu__songName ${isActive(idx) ? 'QueueMenu__songName--selected' : ''}`}
                data-tip={`Track name: ${track.track_name}`}>{track.track_name}</span>
          <span className="QueueMenu__songArtist"
                data-tip={`Artist name: ${JSON.parse(track.track_artist_name).join(', ')}`}>{JSON.parse(track.track_artist_name).join(', ')}</span>
        </div>

        <div className="absclear">
          <div className="QueueMenu__hover">
            <div className="QueueMenu__light">
              <i
                className="QueueMenu__close fa fa fa-times fa-1 fa-fw"
                onClick={() => removeTrackFromQueue(idx)}
                data-tip="Remove this track from queue"
              />
              <i
                className="QueueMenu__expand fa fa fa-expand fa-1 fa-fw"
                onClick={() => handleExpandClick(track, spotifyPlayer.queue)}
                data-tip="View album art"
              />
              <div className="QueueMenu__actions">
                <i
                  className="fa fa fa-play fa-1 fa-fw"
                  onClick={() => helperFuncs.playExternalTrack(track, 'queue', idx)}
                />
                <i
                  className="fa fa fa-heart fa-1 fa-fw"
                  onClick={() => helperFuncs.addFavorite(track)}
                  data-tip="Add track to favorites"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      ))}
      </div>
    </div>
  )
}


export default connect(mapStateToProps, mapDispatchToProps)(QueueMenu);
