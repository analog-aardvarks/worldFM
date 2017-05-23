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

function windowWidth(state = window.innerWidth, action) {
  switch (action.type) {
    case 'WINDOW_RESIZE':
      return action.newSize;
    default:
      return state;
  }
}

const reducer = combineReducers({
  playlist,
  currentSong,
  windowWidth,
  // burgerMenu,
});

export default reducer;

// const state = {
//   playlist: [], // SET_PLAYLIST
//   currentSong: '', // SET_CURRENT_SONG
//   isPlaying: false, // PLAY_PLAYER, PAUSE_PLAYER
//   windowSize: { w: 100, h: 100 }, // RESIZE_WINDOW
//   // flags: bool and/or {}, (for animations)
// }
