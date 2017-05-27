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
  // console.log('WHOLE FRICKIN THING: ', req);
  // console.log('REQ.BODY ON PLAY: ', req.body);
  // console.log('REQ.USER ON PLAY:', req.user);
  // console.log('REQ.PARAMS: ', req.params);
  const track = req.body;
  const position = track.track_position - 1;
  const url = 'https://api.spotify.com/v1/me/player/play';// ?device_id=${deviceID}`;

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
  console.log(options.body);
  request.put('https://api.spotify.com/v1/me/player/play', options)
    .then(response => res.send(response))
    .catch(err => res.status(400).send(err));
};

Player.isAuth = (req, res) => {
  if (req.user !== undefined) res.status(200).send();
  else res.status(201).send();
};

Player.pause = (req, res) => {
  if (req.user) {
    request({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/pause`,
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    })
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send(err));
  }
};

Player.volume = (req, res) => {
  if (req.user) {
    request({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${req.query.volume}`,
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    })
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send(err));
  }
};

module.exports = Player;
