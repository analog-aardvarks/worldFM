const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const app = express();

let config = {};
try { config = require('./../../config'); } catch { }

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.seshSecret || config.seshSecret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
app.use(routes);


const port = process.env.PORT || config.port;
app.listen(port, () =>
  console.log(`Listening on port ${port}`));
