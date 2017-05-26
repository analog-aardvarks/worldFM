const rpn = require('request-promise-native');

const token = '';
const Devices = {};

Devices.info = (req, res) => {
  rpn({
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: { Authorization: `Bearer ${req.user.accessToken}` },
  })
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch(err => res.status(404).send(err));
};

module.exports = Devices;
