const request = require('request-promise-native');

const Player = {};


// commented for now but this may be useful for debugging pause/play if that proves janky
// Player.info = (req, res) => {
//   const deviceID = req.user.activeDevice.id;
//   request({
//     method: 'GET',
//     url: `https://api.spotify.com/v1/me/player?device_id=${deviceID}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };

Player.play = (req, res) => {
  const deviceID = req.user.activeDevice.id;
  const type = req.query.type;
  const id = req.query.id;
  // only for type playlist
  const offset = req.body.user;

  const options = {
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
    body: {},
  };
  options.body = { context_uri: `spotify:${user ? `user:${user}:` : ''}${type}:${id}` };
  if (type === 'playlist') options.body.offset = { position: offset ? parseInt(offset, 10) : 1 };
  options.body = JSON.stringify(options.body);

  request(options)
    .then(response => res.status(200).send(response))
    .catch(err => res.status(400).send(err));
};

Player.pause = (req, res) => {
  const device = req.user.activeDevice.id;
  request({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/pause?device_id=${device}`,
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
  })
    .then(response => res.status(200).send())
    .catch(err => res.status(400).send(err));
};

Player.volume = (req, res) => {
  const device = req.user.activeDevice.id;
  const volume = req.query.volume;
  request({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/volume?device_id=${device}&volume_percent=${volume}`,
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
  })
  .then(response => res.status(200).send(response))
  .catch(err => res.status(400).send(err));
};

// Deprecated, maybe useful later

// Player.seek = (req, res) => {
//   const device = req.user.activeDevice.id;
//   const ms = req.query.ms;
//   request({
//     method: 'PUT',
//     url: `https://api.spotify.com/v1/me/player/seek?device_id=${device}&position_ms=${ms}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };
//
// Player.next = (req, res) => {
//   const device = req.body.device;
//   request({
//     method: 'POST',
//     url: `https://api.spotify.com/v1/me/player/next?device_id=${device}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };
//
// Player.prev = (req, res) => {
//   const device = req.body.device;
//   request({
//     method: 'POST',
//     url: `https://api.spotify.com/v1/me/player/previous?device_id=${device}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };
//
// Player.shuffle = (req, res) => {
//   const device = req.body.device;
//   const shuffle = req.query.shuffle;
//   request({
//     method: 'PUT',
//     url: `https://api.spotify.com/v1/me/player/shuffle?device_id=${device}&state=${shuffle}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };

// Player.repeat = (req, res) => {
//   const device = req.user.activeDevice.id;
//   const repeat = req.query.repeat;
//   request({
//     method: 'PUT',
//     url: `https://api.spotify.com/v1/me/player/repeat?device_id=${device}&state=${repeat}`,
//     headers: { Authorization: `Bearer ${req.user.accessToken}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };


module.exports = Player;
