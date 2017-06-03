import { connect } from 'react-redux';
import { togglePlay,
  setWindowWidth,
  closeSongMenu,
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  setFavorites,
  addTrackToSpotifyQueue,
  setSpotifyPlayerCurrentTrack,
} from '../actions';
import SongList from '../components/SongList';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  togglePreview: (src) => {
    dispatch(togglePlay(src));
    dispatch(closeSongMenu());
  },
  onWindowResize: newSize =>
    dispatch(setWindowWidth(newSize)),
  pauseSpotifyPlayerHandler: isPaused => dispatch({ type: 'PAUSE_SPOTIFY_PLAYER', isPaused }),
  setSpotifyPlayerCurrentTrackHandler: track => dispatch(setSpotifyPlayerCurrentTrack(track)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
  setSpotifyPlayerIntervalHandler: interval => dispatch(setSpotifyPlayerInterval(interval)),
  clearSpotifyPlayerIntervalHandler: () => dispatch({ type: 'CLEAR_SPOTIFY_PLAYER_INTERVAL' }),
  handleFavoritesChange: favorites => dispatch(setFavorites(favorites)),
  addTrackToSpotifyQueue: track => dispatch(addTrackToSpotifyQueue(track)),
});

const Playlist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongList);

export default Playlist;
