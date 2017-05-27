import { connect } from 'react-redux';
import { togglePlay,
  setWindowWidth,
  openSongMenu,
  closeSongMenu,
  playSpotifyPlayer,
  pauseSpotifyPlayer,
} from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = ({ playlist, windowWidth, currentSong, showTrackInfo, songMenu, auth, spotifyPlayer }) => ({
  playlist,
  windowWidth,
  currentSong,
  showTrackInfo,
  songMenu,
  auth,
  spotifyPlayer,
});

const mapDispatchToProps = dispatch => ({
  togglePreview: (src) => {
    dispatch(togglePlay(src));
    dispatch(closeSongMenu());
  },
  playSpotifyPlayer: (track) => {
    fetch('/player/play', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(() => dispatch(playSpotifyPlayer(track)))
    .catch(err => console.log(err));
  },
  pauseSpotifyPlayer: () => {
    fetch('/player/pause', { credentials: 'include' })
      .then(dispatch(pauseSpotifyPlayer()))
      .catch(err => console.log(err));
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
