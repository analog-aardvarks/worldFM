const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const Devices = require('./helpers/Devices');
const config = process.env.SPOTIFYID ? {
  clientID: process.env.SPOTIFYID,
  clientSecret: process.env.SPOTIFYSECRET,
} : require('../../config');

const baseURL = process.env.BASEURL || 'http://localhost:8080';

passport.use(new SpotifyStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: `${baseURL}/auth/spotify/callback`,
},
(accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  Devices.getDevices(profile)
    .then(userInfo => done(null, userInfo));
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

exports.checkAuth = (req, res, next) => {
  if (!req.isAuthenticated) res.status(403).send();
  else return next();
};
