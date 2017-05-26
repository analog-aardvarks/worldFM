import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  showQueMenu: state.showQueMenu,
})

const mapDispatchToProps = dispatch => ({
  hideQueMenuEvent: () => dispatch({ type: 'HIDE_QUE_MENU' }),
})

const QueMenu = ({ showQueMenu }) => {
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
    <div className="QueMenu" style={{ display: showQueMenu ? "block" : "none" }}>
      {songTestList.map((song, idx) => (
        <div className="IndividualSong" key={song.key}>
          <span>{idx+1}</span>
          <span>{song.Artist}</span>
          <span>{song.SongName}</span>
          <span>{song.Time}</span>
        </div>
      ))}
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(QueMenu);
