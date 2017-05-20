const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

const config = require('../../config');
const auth = require('./auth');
const routes = require('./routes');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.seshSecret }))
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

// app.get('/', (req, res) => res.send('Sup, World'));


const port = process.env.port || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
