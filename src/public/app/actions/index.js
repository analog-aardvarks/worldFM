export function setCurrentSong(previewUrl) {
  return {
    type: 'PLAY_PREVIEW',
    previewUrl,
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
