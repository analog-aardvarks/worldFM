const fetch = require('node-fetch');
const auth = require('./auth');
// const token =

module.exports.getPlaylist = (req, res) => {
  fetch('https://api.spotify.com/v1/users/thesoundsofspotify/playlists/4LbFHmTvu6bQldLAiCQ8KF', {
    dataType: 'json',
    headers: `Authorization: Bearer ${auth.accessToken}`,
  })
    .then((response) => {
      // console.log('fetched: ', response);
      res.send(JSON.stringify(response), null, 4);
    });
};
