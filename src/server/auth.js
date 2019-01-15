const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./helpers/User');

let config = {};
try { config = require('./../../config'); } catch { }

const baseURL = process.env.baseUrl || config.baseUrl;

passport.use(new SpotifyStrategy({
  clientID: process.env.clientID || config.clientID,
  clientSecret: process.env.clientSecret || config.clientSecret,
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
