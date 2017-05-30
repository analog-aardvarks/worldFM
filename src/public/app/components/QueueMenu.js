import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showQueueMenu: state.showQueueMenu,
})

const mapDispatchToProps = dispatch => ({
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
})

const QueueMenu = ({ showQueueMenu, toggleQueueMenu }) => {
  let songTestList = [
    {
      Artist: 'Bob',
      SongName: 'Song 1',
      Time: '2:21',
      key: 1
    },
    {
      Artist: 'Ashley',
      SongName: 'Song 2',
      Time: '3:11',
      key: 2,
    },
    {
      Artist: 'Rob',
      SongName: 'Song 3',
      Time: '10:21',
      key: 3
    },

  ];
  return (
    <div className="QueueMenu" style={{ display: showQueueMenu ? "block" : "none" }}>

      <div className="QueueMenu--TopBar">
        <i className="fa fa fa-times fa-1 fa-fw" onClick={toggleQueueMenu} />
      </div>

      <div className="QueueMenu--SongList">
      {songTestList.map((song, idx) => (
        <div className="QueueMenu--IndividualSong" key={song.key}>
          <span>{idx+1}</span>
          <span>{song.Artist}</span>
          <span>{song.SongName}</span>
          <span>{song.Time}</span>
        </div>
      ))}
      </div>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(QueueMenu);
