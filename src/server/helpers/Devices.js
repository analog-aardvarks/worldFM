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
      req.user.devices = JSON.parse(response).devices;
      req.user.activeDevice = req.user.devices.filter(d => d.is_active)[0];
      console.log(req.user.activeDevice)
      res.send(response);
    })
    .catch(err => res.status(404).send(err));
};

Devices.getDevices = profile =>
  new Promise((resolve, reject) => {
    rpn({
      method: 'GET',
      url: 'https://api.spotify.com/v1/me/player/devices',
      headers: { Authorization: `Bearer ${profile.accessToken}` },
    })
    .then((response) => {
      profile.devices = JSON.parse(response).devices;
      profile.activeDevice = profile.devices.filter(d => d.is_active)[0];
      resolve(profile);
    })
    .catch(err => reject(err));
  });


module.exports = Devices;
