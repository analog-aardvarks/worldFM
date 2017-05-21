const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;
const getPlaylist = require('./api').getPlaylist;

const Track = require('./db/models/track.js');
const Playlist = require('./db/models/playlist.js');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

routes.get('/auth/spotify', passport.authenticate('spotify'));
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

routes.get('/playlist', getPlaylist);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tracks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// gets information about a track
// expects a track id, if no id is passed it will return an array of all tracks
// example http://localhost:8080/track
// example http://localhost:8080/track?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/track', Track.getSong);

// save a track in the database
// input is a track object
routes.post('/track', Track.postSong);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Playlists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// gets information about a playlist
// expects a playlist id, if no id is passed it will return an array of all playlists
// example http://localhost:8080/playlist/info
// example http://localhost:8080/playlist/info?id=4LbFHmTvu6bQldLAiCQ8KG
routes.get('/playlist/info', Playlist.getPlaylistInfo);

// get /playlist () the needle world mix
//routes.get('/playlists', Playlist.getPlaylist);

// get /playlist/info

// get /playlist/current () the needle world mix current

// get /playlist/emerging () the needle world mix current

// get /playlist/underground () the needle world mix current

// get /playlist/:country () playlist mix for that country

// get /playlist/:country/current () playlist mix for that country

// get /playlist/:country/emerging () playlist mix for that country

// get /playlist/:country/underground () playlist mix for that country

module.exports = routes;
