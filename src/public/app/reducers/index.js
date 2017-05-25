import { combineReducers } from 'redux';
// import {reducer as burgerMenu} from 'redux-burger-menu';

function playlist(state = [], action) {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return action.playlist;
    default:
      return state;
  }
}

function currentSong(state = {}, action) {
  switch (action.type) {
    case 'TOGGLE_PLAY':
      if (state.src === action.src) {
        return Object.assign({}, state, { isPlaying: !state.isPlaying });
      }
      return { src: action.src, isPlaying: true };
    default:
      return state;
  }
}

function currentCountry(state = 'World', action) {
  switch (action.type) {
    case 'SET_CURRENT_COUNTRY':
      return action.country;
    default:
      return state;
  }
}

function currentTrend(state = 'Mix', action) {
  switch (action.type) {
    case 'SET_CURRENT_TREND':
      return action.trend;
    default:
      return state;
  }
}

function windowWidth(state = window.innerWidth, action) {
  switch (action.type) {
    case 'WINDOW_RESIZE':
      return action.newSize;
    default:
      return state;
  }
}

function showTrackInfo(state = false, action) {
  switch (action.type) {
    case 'SHOW_TRACK_INFO': return true;
    case 'HIDE_TRACK_INFO': return false;
    default: return state;
  }
}

function showSpotifyPlaylist(state = false, action) {
  switch (action.type) {
    case 'SHOW_SPOTIFY_PLAYLIST': return true;
    case 'HIDE_SPOTIFY_PLAYLIST': return false;
    default: return state;
  }
}

const reducer = combineReducers({
  playlist,
  currentSong,
  currentCountry,
  currentTrend,
  windowWidth,
  showTrackInfo,
  showSpotifyPlaylist,
});

export default reducer;

// STATE TREE:
// {
//   playlist: [], SET_PLAYLIST
//   currentSong: { src: URL, isPlaying: bool }, SET_CURRENT_SONG
//   isPlaying: false, PLAY_PLAYER, PAUSE_PLAYER
//   windowSize: { w: 100, h: 100 }, RESIZE_WINDOW
//   currentCountry: 'World', SET_CURRENT_COUNTRY
//   currentTrend: 'Mix', SET_CURRENT_TREND
// }
