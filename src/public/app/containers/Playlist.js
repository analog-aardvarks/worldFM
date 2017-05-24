import { connect } from 'react-redux';
import { setCurrentSong, setWindowWidth } from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist, windowWidth, currentSong }) => ({
  playlist,
  windowWidth,
  currentSong,
});

const mapDispatchToProps = dispatch => ({
  onClick: src =>
    dispatch(setCurrentSong(src)),
  onWindowResize: newSize =>
    dispatch(setWindowWidth(newSize)),
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
