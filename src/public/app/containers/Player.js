import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';

const mapStateToProps = state => ({
  currentSong: state.currentSong,
  // isPLaying
});

//

class Player extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.currentSong.isPlaying) {
      this.playElement.play();
    } else {
      this.playElement.pause();
    }
  }

  // const playStatus = currentSong.isPlaying ? 'autoplay' : null;

  render() {
    return (
      <div>
        <audio
          ref={el => this.playElement = el}
          src={this.props.currentSong.src}
          controls
        />
      </div>
    );
  }
}

Player = connect(mapStateToProps)(Player)

export default Player;
