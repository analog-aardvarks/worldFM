import { connect } from 'react-redux';
import { setCurrentSong } from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist }) => ({
  playlist,
  // windowHeight
  // windowWidth
});

const mapDispatchToProps = dispatch => ({
  onClick: previewUrl =>
    dispatch(setCurrentSong(previewUrl)),
/*onWindowResize: newSize =>
    dispatch({ type: 'WINDOW_RESIZE', width: newSize }),*/
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
