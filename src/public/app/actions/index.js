export function setCurrentSong(previewUrl) {
  return {
    type: 'SET_CURRENT_SONG',
    previewUrl,
  };
}

export function setPlaylist(playlist) {
  return {
    type: 'SET_PLAYLIST',
    playlist,
  };
}
