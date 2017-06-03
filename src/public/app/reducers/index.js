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
        return { ...state, isPlaying: !state.isPlaying };
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

function windowHeight(state = window.innerHeight, action) {
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

function showCountryMenu(state = false, action) {
  switch(action.type) {
    case 'SHOW_COUNTRY_MENU': return true;
    case 'HIDE_COUNTRY_MENU': return false;
    default: return state;
  }
}

function showQueueMenu(state = false, action) {
  switch(action.type) {
    case 'SHOW_QUEUE_MENU': return true;
    case 'HIDE_QUEUE_MENU': return false;
    default: return state;
  }
}

function showFavoritesMenu(state = false, action) {
  switch(action.type) {
    case 'SHOW_FAVORITES_MENU': return true;
    case 'HIDE_FAVORITES_MENU': return false;
    default: return state;
  }
}

function songMenu(state = null, action) {
  switch (action.type) {
    case 'OPEN_SONG_MENU': return action.index;
    case 'CLOSE_SONG_MENU': return null;
    default: return state;
  }
}

function showSideMenu(state = false, action) {
  switch (action.type) {
    case 'SHOW_SIDE_MENU': return true;
    case 'HIDE_SIDE_MENU': return false;
    default: return state;
  }
}

function showAbout(state = false, action) {
  switch (action.type) {
    case 'SHOW_ABOUT': return true;
    case 'HIDE_ABOUT': return false;
    default: return state;
  }
}

function showVolumeGauge(state = false, action) {
  switch(action.type) {
    case 'SHOW_VOLUME_GAUGE': return true;
    case 'HIDE_VOLUME_GAUGE': return false;
    default: return state;
  }
}

function showAvailableDevices(state = false, action) {
  switch (action.type) {
    case 'SHOW_AVAILABLE_DEVICES': return true;
    case 'HIDE_AVAILABLE_DEVICES': return false;
    default: return state;
  }
}

function availableDevices(state = [], action) {
  switch (action.type) {
    case 'SET_DEVICES': return action.devices;
    default: return state;
  }
}

function spotifyPlayer(state = {
  queue: [],
  currentTrack: null,
  isPaused: undefined,
  volume: 0,
  mute: false,
  ellapsed: 0,
  interval: undefined,
}, action) {
  switch (action.type) {
    case 'PAUSE_SPOTIFY_PLAYER': return { ...state, isPaused: action.isPaused };
    case 'SET_SPOTIFY_PLAYER_CURRENT_TRACK': return { ...state, currentTrack: action.track };
    case 'SET_SPOTIFY_PLAYER_VOLUME': return { ...state, volume: action.volume };
    case 'ADD_TRACK_TO_SPOTIFY_QUEUE':
      const queueAdd = [...state.queue];
      queueAdd.push(action.track);
      return { ...state, queue: queueAdd };

    case 'REMOVE_TRACK_FROM_SPOTIFY_QUEUE':
      const queueRemove = [...state.queue];
      const idx = action.track;
      queueRemove.splice(idx, 1);
      return { ...state, queue: queueRemove };

    case 'SET_SPOTIFY_PLAYER_MUTE': return { ...state, mute: action.mute };
    case 'SET_SPOTIFY_PLAYER_ELLAPSED': return { ...state, ellapsed: action.ellapsed };
    case 'SET_SPOTIFY_PLAYER_INTERVAL': return { ...state, interval: action.interval };
    case 'CLEAR_SPOTIFY_PLAYER_INTERVAL': return { ...state, interval: clearInterval(state.interval) };
    default: return state;
  }
}

function auth(state = false, action) {
  switch (action.type) {
    case 'AUTHENTICATE_USER': return true;
    default: return state;
  }
}

function favorites(state = [], action) {
  switch (action.type) {
    case 'SET_FAVORITES':
      return action.favorites;
    default: return state;
  }
}

function showTopMenu(state = false, action) {
  switch (action.type) {
    case 'SHOW_TOP_MENU': return true;
    case 'HIDE_TOP_MENU': return false;
    default: return state;
  }
}

function sync(state = 0, action) {
  switch (action.type) {
    case 'SET_SPOTIFY_SYNC': return 1;
    default: return state;
  }
}

function activeDevice(state = {}, action) {
  switch (action.type) {
    case 'SET_ACTIVE_DEVICE': return action.device;
    default: return state;
  }
}

const reducer = combineReducers({
  activeDevice,
  sync,
  playlist,
  currentSong,
  currentCountry,
  currentTrend,
  windowWidth,
  windowHeight,
  showTrackInfo,
  showSpotifyPlaylist,
  showCountryMenu,
  showQueueMenu,
  showFavoritesMenu,
  songMenu,
  showSideMenu,
  auth,
  spotifyPlayer,
  showVolumeGauge,
  availableDevices,
  showAvailableDevices,
  favorites,
  showAbout,
  showTopMenu,
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
