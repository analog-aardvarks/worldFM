const request = require('request-promise-native');

const Player = {};

Player.play = (req, res) => {
  const deviceID = req.query.device;
  const track = req.body;
  const position = track.track_position - 1;
  const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`;
  const options = {
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
    body: {
      context_uri: `spotify:album:${track.track_album_id}`,
    },
  };
  if (track.track_album_type === 'album') {
    options.body.offset = { position };
  }
  options.body = JSON.stringify(options.body);
  request.put(url, options)
    .then(response => res.send(response))
    .catch(err => res.status(400).send(err));
};

Player.pause = (req, res) => {
  if (req.user) {
    request({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    })
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send(err));
  }
};

Player.volume = (req, res) => {
  const deviceID = req.query.device || false;
  if (req.user) {
    request({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${req.query.volume}${deviceID ? `&device_id=${deviceID}` : ''}`,
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    })
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send(err));
  }
};

Player.seek = (req, res) => {
  const deviceID = req.query.device || false;
  const ms = req.query.ms;
  request({
    method: 'PUT',
    url: `https://api.spotify.com/v1/me/player/seek?position_ms=${ms}${deviceID ? `&device_id=${deviceID}` : ''}`,
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
  })
    .then(response => res.status(200).send(response))
    .catch(err => res.status(400).send(err));
};

module.exports = Player;
