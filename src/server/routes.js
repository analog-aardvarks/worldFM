const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;
const getPlaylist = require('./api').getPlaylist;

const Track = require('./db/models/Track.js');
const Playlist = require('./db/models/Playlist.js');

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

//routes.get('/playlist', getPlaylist);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tracks
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// gets information about a track
// expects a track id, if no id is passed it will return an array of all tracks
// example http://localhost:8080/track
// example http://localhost:8080/track?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/tracks', Track.getTrack);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Playlists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// gets information about a playlist tracks
// expects: country, trend, random, limit
// defaults:
// if country is not defined, will return global playlist (accepts multiple arguments separated by a comma and no spaces)
// if trend is not defined, will return a mix all trends (accepts multiple arguments separated by a comma and no spaces)
// if random is not defined, will return an ordered list (queries with multiple countries or trends will always be random)
// if limit is not defined, will return 100 tracks
// example http://localhost:8080/playlist?country=Mexico,Argentina,Colombia,United+States&trend=current,underground&limit=35
// example http://localhost:8080/playlist?country=Mexico&trend=current&random=true
// example http://localhost:8080/playlist?trend=underground&limit=50
// example http://localhost:8080/playlist
routes.get('/playlist', Playlist.getPlaylist);

// gets information about a playlist
// expects a playlist id, if no id is passed it will return an array of all playlists
// example http://localhost:8080/playlist
// example http://localhost:8080/playlist?id=3zT1inKSRDpJvkAXGV7fBd
routes.get('/playlist/info', Playlist.getPlaylistInfo);

module.exports = routes;
