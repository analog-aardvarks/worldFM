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

function currentSong(state = '', action) {
  switch (action.type) {
    case 'PLAY_PREVIEW':
      return action.previewUrl;
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

const reducer = combineReducers({
  playlist,
  currentSong,
  currentCountry,
  currentTrend,
});

export default reducer;

// STATE TREE:
// {
//   playlist: [], SET_PLAYLIST
//   currentSong: '', SET_CURRENT_SONG
//   isPlaying: false, PLAY_PLAYER, PAUSE_PLAYER
//   windowSize: { w: 100, h: 100 }, RESIZE_WINDOW
//   currentCountry: 'World', SET_CURRENT_COUNTRY
//   currentTrend: 'Mix', SET_CURRENT_TREND
// }
