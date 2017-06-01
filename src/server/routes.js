const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;

const Track = require('./helpers/Track');
const Playlist = require('./helpers/Playlist');
const MapData = require('./helpers/MapData');
const Player = require('./helpers/Player');
const Devices = require('./helpers/Devices');
const UserPlaylist = require('./helpers/UserPlaylist');
const User = require('./helpers/User');
const favorites = require('./helpers/favorites');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

routes.get('/auth/spotify', passport.authenticate('spotify',
  { scope: ['user-read-playback-state', 'user-modify-playback-state', 'user-library-modify'] }));

routes.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie('auth', 'true');
    Devices.getDevices(req).then(res.redirect('/'));
  });

routes.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

routes.get('/loggedIn', checkAuth, (req, res) => {
  res.send(`<p>Logged in! User info:</p>
    <a href="/auth/logout">Log out</a>
    <pre>${JSON.stringify(req.user, null, 4)}</pre>`);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tracks
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Gets information about available tracks
// Params: id
// Examples:
// http://localhost:8080/track
// http://localhost:8080/track?id=${track_id}
routes.get('/tracks', Track.getTrack);

// Gets the number of available tracks stored in the database
routes.get('/tracks/length', Track.getTrackLength);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Playlists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Gets a curated list of tracks based on the parameters given
// Params: country, trend, random, limit
// Examples:
// http://localhost:8080/playlist?country=Mexico,Argentina,Colombia,USA&trend=Current,Underground&limit=35
//  -> Will return 35 random Current or Underground tracks from Mexico, Argentina, Colombia or USA
// http://localhost:8080/playlist?country=Mexico&trend=Current&random=true
//  -> Will return 100 ordered Current tracks from Mexico
// http://localhost:8080/playlist?trend=Underground&limit=50
//  -> Will return 50 random Underground tracks from 'The Needle' (world mix)
// example http://localhost:8080/playlist
//  -> Will return 100 random tracks from the 'The Needle' (world mix)
routes.get('/playlist', Playlist.getPlaylist);

// Gets information about available playlists
// Params: id
// Examples:
// http://localhost:8080/playlist
// http://localhost:8080/playlist?id=${playlist_id}
routes.get('/playlist/info', Playlist.getPlaylistInfo);

// Gets the number of available playlists stored in the database
routes.get('/playlist/length', Playlist.getPlaylistLength);

// Gets the names of available playlists stored in the database
routes.get('/playlist/names', Playlist.getPlaylistNames);

// Serve data to d3 for asnyc loading
routes.get('/data/world-110m.json', MapData.getWorldJson);
routes.get('/data/world-110m-country-names.tsv', MapData.getCountryNames);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Devices
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get a User's Available Devices
// http://localhost:8080/devices
// Response:
// {
//   "devices" : [ {
//     "id" : "9f2d444a827b1e993c2eaa9fe0dca6eb0f311169",
//     "is_active" : true,
//     "is_restricted" : false,
//     "name" : "Arturo’s MacBook Air",
//     "type" : "Computer",
//     "volume_percent" : 100
//   } ]
// }
routes.get('/devices', Devices.info);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Player
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Get Information About The User's Current Playback
// Params: device
// Examples:
// http://localhost:8080/player/info?device=${device_id}
// Response:
// {
//   "timestamp" : 1495773587619,
//   "progress_ms" : 4692,
//   "is_playing" : true,
//   "item" : { ... },
//   "context" : null,
//   "device" : { ... },
//   "repeat_state" : "track",
//   "shuffle_state" : true
// }
// routes.get('/player/info', Player.info);

// Start a User's Playback
// Request body contains song object with optional millisecond start point
// Deprecated examples:
// http://localhost:8080/player/play?device=${device_id}&type=artist&id={artist_id}
// http://localhost:8080/player/play?device=${device_id}&type=album&id={album_id}
// http://localhost:8080/player/play?device=${device_id}&type=album&id={album_id}&offset=5
// http://localhost:8080/player/play?device=${device_id}&type=playlist&id={playlist_id}&user=${playlist_owner}
// http://localhost:8080/player/play?device=${device_id}&type=playlist&id={playlist_id}&user=${playlist_owner}&offset=10
routes.put('/player/play', Player.play);

// Start a User's Playback
// Uses user's active device at time of login
routes.get('/player/pause', Player.pause);
routes.get('/player/seek', Player.seek);

// Set Volume For User's Playback
// Params: device, volume
// Examples:
// http://localhost:8080/player/info?device=${device_id}&volume=100
// http://localhost:8080/player/info?device=${device_id}&volume=50
// http://localhost:8080/player/info?device=${device_id}&volume=0
routes.get('/player/volume', Player.volume);

routes.get('/player/auth', Player.isAuth);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// User Playlists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// routes.get('/userplaylist/info', UserPlaylist.getInfo);
// routes.get('/userplaylist/delete', UserPlaylist.removeFromPlaylist);

routes.route('/favorites')
  .get(User.getFavoriteTracks)
  .put(User.addFavorite)
  .delete(User.removeFavorite);

routes.get('/sync', User.toggleSync);

module.exports = routes;
