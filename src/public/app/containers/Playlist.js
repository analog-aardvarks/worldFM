import { connect } from 'react-redux';
import { togglePlay, setWindowWidth } from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist, windowWidth, currentSong, showTrackInfo }) => ({
  playlist,
  windowWidth,
  currentSong,
  showTrackInfo,
});

const mapDispatchToProps = dispatch => ({
  onClick: src =>
    dispatch(togglePlay(src)),
  onWindowResize: newSize =>
    dispatch(setWindowWidth(newSize)),
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
