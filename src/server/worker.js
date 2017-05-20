const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../../config');

var spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
});
spotifyApi.setAccessToken(config.token);

console.log('Starting Worker...');
console.log(`Spotify OAuth Token: ${config.token}`);

const getPlaylist = function(owner, id, playlist_id) {
  console.log('getPlaylist invoked owner: ', owner, 'id: ', id);

  spotifyApi.getPlaylist(owner, id)
    .then(function(data) {
      console.log('fetched playlist with id: ', id);

      return data.body.tracks.items.map(item => {
        return {
          track_id: item.track.id,
          track_name: item.track.name,
          track_preview_url: item.track.preview_url,
          track_album_id: item.track.album.id,
          track_album_image: item.track.album.images[0].url,
          track_artists_name: item.track.artists[0].name,
          track_playlist_id: playlist_id,
        }
      });
    })
    .then(function(data) {
      data.forEach(track => {
        console.log('saved track with name: ', track.track_name);
      });
      // actually save into db here!
    })
    .catch(function(err) {
      console.log('Something went wrong!', err);
    });
}

const getUserPlaylists = function(user, limit, offset) {
  console.log('getUserPlaylists invoked user: ', user, 'limit: ', limit, 'offset: ', offset);

  spotifyApi.getUserPlaylists(user, { limit: limit, offset: offset })
    .then(function(data) {
      console.log('fetched user playlist for: ', user);

      return data.body.items.map(item => {
        return {
          playlist_id: item.id,
          playlist_name: item.name,
          playlist_tracks_total: item.tracks.total,
        }
      });
    })
    .then(function(data) {
      data.forEach(playlist => {
        console.log('saved playlist with name: ', playlist.playlist_name);
      });
      // save into db here!
      return data;
    })
    .then(function(data) {
      data.forEach(playlist => {
        console.log('fetching tracks for playlist: ', playlist.playlist_name);
        getPlaylist(user, playlist.playlist_id);
      });
    })
    .catch(function(err) {
      console.log('Something went wrong!', err);
    });
}

const workerInit = function() {
  getUserPlaylists('thesoundsofspotify', 50,   0);
  getUserPlaylists('thesoundsofspotify', 50,  50);
  getUserPlaylists('thesoundsofspotify', 50, 100);
  getUserPlaylists('thesoundsofspotify', 50, 150);
  getUserPlaylists('thesoundsofspotify',  2, 200);
}

// WARNING! only run when needed, hundreds of API calls in here!
// workerInit();

// TESTS
// getPlaylist('thesoundsofspotify', '0fk9bF0uBAigYUih89Ye30'); // the needle - emerging
// getUserPlaylists('thesoundsofspotify', 5, 0); // some playlists
