export function setCurrentSong(song) {
  return {
    type: 'SET_CURRENT_SONG',
    song,
  };
}

export function setPlaylist(playlist) {
  return {
    type: 'SET_PLAYLIST',
    playlist,
  };
}
