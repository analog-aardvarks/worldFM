const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../../config');

var spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
});
spotifyApi.setAccessToken(config.SPOTIFY_TOKEN);

console.log('Starting Worker...');
console.log(`Spotify Auth is ${config.SPOTIFY_TOKEN}`);

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
//
// const playlists = [];
//
// const getUserPlaylists = function(ownerId, limit, offset, token) {
//   console.log(`Getting ${ownerId} Playlists, limit ${limit}, offset ${offset}`);
//   const url = `https://api.spotify.com/v1/users/${ownerId}/playlists?limit=${limit}&offset=${offset}`;
//   request(url, { headers: { Authorization: `Bearer ${token}`, } })
//   .then(res => {
//     res = JSON.parse(res);
//     res.items.forEach(listItem => {
//       const playlist = {
//         id: listItem.id,
//         name: listItem.name,
//         tracks: listItem.tracks.total,
//       }
//       playlists.push(playlist);
//     });
//     console.log(playlists);
//   })
//   .catch(err => console.log(err));
// }
//
// // main function for the worker
// const getSoundsOfSpotify(token) {
//   console.log('Getting thesoundsofspotify Playlists');
//   getUserPlaylists('thesoundsofspotify', 0,    0, token);
//   getUserPlaylists('thesoundsofspotify', 50,  50, token);
//   getUserPlaylists('thesoundsofspotify', 50, 100, token);
//   getUserPlaylists('thesoundsofspotify', 50, 150, token);
//   getUserPlaylists('thesoundsofspotify',  2, 200, token);
// }
//
// // initialize worker
// getSoundsOfSpotify(config.SPOTIFY_TOKEN);
