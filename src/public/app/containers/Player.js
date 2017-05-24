import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

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
      this.refs.playElement.play();
    } else {
      this.refs.playElement.pause();
    }
  }

  // const playStatus = currentSong.isPlaying ? 'autoplay' : null;

  render() {
    return (
      <div>
        <audio
          ref='playElement'
          src={this.props.currentSong.src}
        />
      </div>
    );
  }
}

Player = connect(mapStateToProps)(Player)

export default Player;
