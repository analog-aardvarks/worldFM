import React from 'react';
import ReactDOM from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';

class Player extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <ReactAudioPlayer
          autoPlay
          src={this.props.currentSong}
        />
      </div>
    );
  }
}

export default Player;
