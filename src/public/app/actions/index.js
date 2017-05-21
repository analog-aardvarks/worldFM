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
