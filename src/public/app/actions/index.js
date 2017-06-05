export function togglePlay(src = '') {
  return { type: 'TOGGLE_PLAY', src };
}

export function setPlaylist(playlist) {
  return { type: 'SET_PLAYLIST', playlist };
}

export function setCurrentCountry(country) {
  return { type: 'SET_CURRENT_COUNTRY', country };
}

export function setCurrentTrend(trend) {
  return { type: 'SET_CURRENT_TREND', trend };
}

export function setWindowSize() {
  return { type: 'WINDOW_RESIZE' };
}

export function showAboutEvent() {
  return { type: 'SHOW_ABOUT' };
}

export function setFavorites(favorites) {
  return { type: 'SET_FAVORITES', favorites };
}

export function playSpotifyPlayer(currentTrack) {
  return { type: 'PLAY_SPOTIFY_PLAYER', currentTrack };
}

export function setSpotifyPlayerVolume(volume) {
  return { type: 'SET_SPOTIFY_PLAYER_VOLUME', volume };
}

export function setSpotifyPlayerCurrentTrackIdx(currentTrackIdx) {
  return { type: 'SET_CURRENT_TRACK_IDX', currentTrackIdx };
}

export function pauseSpotifyPlayer(track) {
  return { type: 'PAUSE_SPOTIFY_PLAYER' };
}

export function addTrackToSpotifyQueue(track) {
  return { type: 'ADD_TRACK_TO_SPOTIFY_QUEUE', track };
}

export function removeTrackFromSpotifyQueue(track) {
  return { type: 'REMOVE_TRACK_FROM_SPOTIFY_QUEUE', track };
}

export function setSpotifyPlayerMute(mute) {
  return { type: 'SET_SPOTIFY_PLAYER_MUTE', mute };
}

export function setSpotifyPlayerEllapsed(ellapsed) {
  return { type: 'SET_SPOTIFY_PLAYER_ELLAPSED', ellapsed };
}

export function setSpotifyPlayerInterval(interval) {
  return { type: 'SET_SPOTIFY_PLAYER_INTERVAL', interval };
}

export function showLightbox(src) {
  return { type: 'SHOW_LIGHTBOX', src };
}

export function setSpotifyPlayerCurrentTrack(track) {
  return { type: 'SET_SPOTIFY_PLAYER_CURRENT_TRACK', track };
}
