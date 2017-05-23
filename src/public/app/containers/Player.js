import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';

const mapStateToProps = state => ({
  currentSong: state.currentSong,
  // isPLaying
});

//

let Player = ({ currentSong }) => {

  // element.pause()
  // element.play()

  return (
    <div>
      <ReactAudioPlayer
        autoPlay
        src={currentSong}
      />
    </div>
  );
}

Player = connect(mapStateToProps)(Player)

export default Player;
