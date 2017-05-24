export function setCurrentSong(src) {
  return {
    type: 'TOGGLE_PLAY',
    src,
  };
}

export function setPlaylist(playlist) {
  return {
    type: 'SET_PLAYLIST',
    playlist,
  };
}

export function setCurrentCountry(country) {
  return {
    type: 'SET_CURRENT_COUNTRY',
    country,
  };
}

export function setCurrentTrend(trend) {
  return {
    type: 'SET_CURRENT_TREND',
    trend,
  };
}

export function setWindowWidth(newSize) {
  return {
    type: 'WINDOW_RESIZE',
    newSize,
  };
}

export function openSongMenu(index) {
  return {
    type: 'OPEN_SONG_MENU',
    index,
  };
}

export function closeSongMenu() {
  return {
    type: 'CLOSE_SONG_MENU',
  };
}
