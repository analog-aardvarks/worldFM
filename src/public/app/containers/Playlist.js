import { connect } from 'react-redux';
import { setCurrentSong, setWindowWidth } from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist, windowWidth }) => ({
  playlist,
  windowWidth,
});

const mapDispatchToProps = dispatch => ({
  onClick: previewUrl =>
    dispatch(setCurrentSong(previewUrl)),
  onWindowResize: newSize =>
    dispatch(setWindowWidth(newSize)),
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
