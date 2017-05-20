import React from 'react';
import ReactDOM from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';

const Player = ({ currentSong }) => {
  return (
    <div>
      <ReactAudioPlayer
        autoPlay
        src={currentSong}
      />
    </div>
  );
}

export default Player;
