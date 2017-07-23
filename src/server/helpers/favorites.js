const request = require('request-promise-native');

exports.addTrack = (req, res) => {
  console.log('track id: ', req.body.track_id);
  const options = { headers: { Authorization: `Bearer ${req.user.accessToken}` } };
  request.put(`https://api.spotify.com/v1/me/tracks?ids=${req.body.track_id}`, options)
    .then(response => res.send('track added'))
    .catch((err) => {
      // console.log(err);
      res.status(400).send('');
    });
};

exports.removeTrack = (req, res) => {
  const options = { headers: { Authorization: `Bearer ${req.user.accessToken}` } };
  request.put(`https://api.spotify.com/v1/me/tracks?ids=${req.body}`, options)
    .then(response => res.send(response))
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
};
