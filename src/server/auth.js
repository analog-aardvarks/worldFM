const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const User = require('./helpers/User');
const Devices = require('./helpers/Devices');
const config =  {
  clientID: process.env.spotifyClient,
  clientSecret: process.env.spotifySecret
};

const baseURL = process.env.url;

passport.use(new SpotifyStrategy({
  clientID: process.env.spotifyClient,
  clientSecret: process.env.spotifySecret,
  callbackURL: `${baseURL}/auth/spotify/callback`,
},
  (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    User.login(profile)
      .then(userInfo => done(null, userInfo))
      .catch(err => console.log(err));
  }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

exports.checkAuth = (req, res, next) => {
  if (!req.isAuthenticated) res.status(403).send();
  else return next();
};
