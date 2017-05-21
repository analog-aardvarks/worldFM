const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;
const getPlaylist = require('./api').getPlaylist;

const Song = require('./db/models/song.js');
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
// Songs
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// gets information about a song
// expects a song id, if no id is passed it will return an array of all songs
// example http://localhost:8080/song
// example http://localhost:8080/song?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/song', Song.getSong);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Playlists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get /playlist () the needle world mix
//routes.get('/playlists', Playlist.getAllPlaylists);

// post /playlist ({ playlist })
//routes.post('/playlists', Playlist.addNewPlaylist);

// get /playlist/current () the needle world mix current

// get /playlist/emerging () the needle world mix current

// get /playlist/underground () the needle world mix current

// get /playlist/:country () playlist mix for that country

// get /playlist/:country/current () playlist mix for that country

// get /playlist/:country/emerging () playlist mix for that country

// get /playlist/:country/underground () playlist mix for that country

module.exports = routes;
