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
  const track = req.body;
  const position = track.track_number;
  const url = 'https://api.spotify.com/v1/me/player/play';// ?device_id=${deviceID}`;

  const options = {
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
    body: {
      context_uri: track.album.uri,
    },
  };
  if (track.album.albumType === 'album') {
    options.body.offset = { position };
  }
  options.body = JSON.stringify(options.body);

  request.put('https://api.spotify.com/v1/me/player/play', options)
    .then(response => res.send(response))
    .catch(err => res.status(400).send(err));
};

Player.pause = (req, res) => {
  const device = req.user.activeDevice.id;
  request.put('https://api.spotify.com/v1/me/player/pause', {
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

module.exports = Player;
