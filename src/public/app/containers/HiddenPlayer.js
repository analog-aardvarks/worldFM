import React from 'react';
import { connect } from 'react-redux';
import { togglePlay } from '../actions';

const mapStateToProps = state => ({
  currentSong: state.currentSong,
});

const mapDispatchToProps = dispatch => ({
  onEnded: src => dispatch(togglePlay(src)),
});

class Audio extends React.Component {
  componentDidUpdate() {
    if (this.props.currentSong.isPlaying) {
      this.audioEl.volume = 0.2;
      this.audioEl.play();
    } else {
      this.audioEl.pause();
    }
  }

  // const playStatus = currentSong.isPlaying ? 'autoplay' : null;

  render() {
    return (
      <div>
        <audio
          ref={(el) => { this.audioEl = el; }}
          onEnded={this.props.onEnded}
          src={this.props.currentSong.src}
        />
      </div>
    );
  }
}

const HiddenPlayer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Audio);

export default HiddenPlayer;
