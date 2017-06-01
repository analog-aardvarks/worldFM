import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showQueueMenu: state.showQueueMenu,
})

const mapDispatchToProps = dispatch => ({
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
})

const QueueMenu = ({ showQueueMenu, toggleQueueMenu, favorites }) => {

  let songTestList = favorites;

  return (
    <div className="QueueMenu" style={{ display: showQueueMenu ? "block" : "none" }} onMouseLeave={toggleQueueMenu}>

      <div className="QueueMenu__topBar">
        <i className="fa fa fa-times fa-1 fa-fw" onClick={toggleQueueMenu} />
      </div>

      <div className="QueueMenu__songList">

        {favorites.reverse().map((track, idx) => (
            <div className="QueueMenu__indivdualSong" key={idx}>
              <span className="QueueMenu__position" >{idx+1}</span>
              <div className="QueueMenu__indivdualSong__songInfoAndPicture">
                <img
                  src={track.track_album_image}
                  width="46"
                  height="46"
                />
                <div className="QueueMenu__indivdualSong__songInfo">
                  <span className="QueueMenu__songName">{track.track_name}</span>
                  <span className="QueueMenu__songArtist">{JSON.parse(track.track_artist_name).join(', ')}</span>
                </div>
              </div>
              <i className="fa fa-minus fa-lg fa-fw" />
            </div>
          ))}

      </div>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(QueueMenu);
