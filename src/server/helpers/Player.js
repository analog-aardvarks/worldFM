const rpn = require('request-promise-native');

const token = '';
const Player = {};

Player.info = (req, res) => {
  const device = req.body.device;
  rpn({
    method: 'GET',
    url: `https://api.spotify.com/v1/me/player?device_id=${device}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.play = (req, res) => {
  const device = req.body.device;
  const type = req.query.type;
  const id = req.query.id;
  // only for type playlist
  const user = req.query.user;
  const offset = req.query.offset;

  const options = {
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
    headers: { Authorization: `Bearer ${token}` },
    body: {},
  };
  options.body = { context_uri: `spotify:${user ? `user:${user}:` : ''}${type}:${id}` };
  if (type === 'playlist') options.body.offset = { position: offset ? parseInt(offset, 10) : 1 };
  options.body = JSON.stringify(options.body);

  rpn(options)
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.pause = (req, res) => {
  const device = req.body.device;
  rpn({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/pause?device_id=${device}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.seek = (req, res) => {
  const device = req.body.device;
  const ms = req.query.ms;
  rpn({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/seek?device_id=${device}&position_ms=${ms}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.next = (req, res) => {
  const device = req.body.device;
  rpn({
    method: 'POST',
    url: `https://api.spotify.com/v1/me/player/next?device_id=${device}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.prev = (req, res) => {
  const device = req.body.device;
  rpn({
    method: 'POST',
    url: `https://api.spotify.com/v1/me/player/previous?device_id=${device}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.shuffle = (req, res) => {
  const device = req.body.device;
  const shuffle = req.query.shuffle;
  rpn({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/shuffle?device_id=${device}&state=${shuffle}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.repeat = (req, res) => {
  const device = req.body.device;
  const repeat = req.query.repeat;
  rpn({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/repeat?device_id=${device}&state=${repeat}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

Player.volume = (req, res) => {
  const device = req.body.device;
  const volume = req.query.volume;
  rpn({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/volume?device_id=${device}&volume_percent=${volume}`,
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(200).send('Success!', response))
    .catch(err => res.status(400).send(err));
};

module.exports = Player;
