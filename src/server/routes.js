const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;

const Track = require('./helpers/Track');
const Playlist = require('./helpers/Playlist');
const MapData = require('./helpers/MapData');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

routes.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-modify-playback-state'] }));
routes.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => res.redirect('/loggedIn'));
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
// Defaults:
//  id  -> If undefined, will return an array containing all available tracks
// Examples (try them in Postman):
// http://localhost:8080/track
// http://localhost:8080/track?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/tracks', Track.getTrack);

// Returns the number of available tracks
routes.get('/tracks/length', Track.getTrackLength);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Playlists
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Gets a curated list of tracks based on the parameters given
// Params: country, trend, random, limit
// Defaults:
//  country -> If undefined, will return a world mix
//             (accepts multiple arguments separated by a comma and no whitespace)
//  trend   -> If undefined, will return a mix of trends
//             (accepts multiple arguments separated by a comma and no whitespace)
//  random  -> If undefined or false, will return an ordered list
//             (queries containing a mix of multiple countries or trends will always be randomized)
//  limit   -> If undefined will return 100 tracks
// Examples (try them in Postman):
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
// Defaults:
//  id  -> If undefined, will return an array containing all available playlists
// Examples (try them in Postman):
// http://localhost:8080/playlist
// http://localhost:8080/playlist?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/playlist/info', Playlist.getPlaylistInfo);

// Returns the number of available playlist
routes.get('/playlist/length', Playlist.getPlaylistLength);

// Serve data to d3 for asnyc loading
routes.get('/data/world-110m.json', MapData.getWorldJson);
routes.get('/data/world-110m-country-names.tsv', MapData.getCountryNames);

module.exports = routes;
