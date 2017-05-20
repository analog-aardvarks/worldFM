const routes = require('express').Router();
const passport = require('passport');
const checkAuth = require('./auth').checkAuth;
const getPlaylist = require('./api').getPlaylist;

let Song = require('./db/models/song.js');
let Playlist = require('./db/models/playlist.js');

// Auth routes
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

//db testing
routes.post('/songs', Song.addNewSong);
routes.get('/songs', Song.getAllSongs);
routes.post('/playlists', Playlist.addNewPlaylist);
routes.get('/playlists', Playlist.getAllPlaylists);

module.exports = routes;
