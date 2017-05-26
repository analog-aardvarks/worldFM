import { connect } from 'react-redux';
import { togglePlay, setWindowWidth, openSongMenu, closeSongMenu } from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist, windowWidth, currentSong, showTrackInfo, songMenu }) => ({
  playlist,
  windowWidth,
  currentSong,
  showTrackInfo,
  songMenu,
});

const mapDispatchToProps = dispatch => ({
  onClick: src => {
    dispatch(togglePlay(src));
    dispatch(closeSongMenu());
  },
  onWindowResize: newSize =>
    dispatch(setWindowWidth(newSize)),
  openSongMenu: index => dispatch(openSongMenu(index)),
  closeSongMenu: () => dispatch(closeSongMenu()),
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
