const rpn = require('request-promise-native');

const token = '';
const Devices = {};

Devices.info = (req, res) => {
  rpn({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => res.status(300).send(response))
    .catch(err => res.status(404).send(err));
};

module.exports = Devices;
