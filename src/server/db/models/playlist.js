const knex = require('../db.js');
const Playlist = {};
Playlist.addNewPlaylist = function(req, res) {

  const sample = {
    playlist_id: '4LbFHmTvu6bQldLAiCQ8KF',
    playlist_name: 'The Needle 20170518',
    playlist_tracks_total: 300,
  }

  return knex('playlists').insert(sample)
    .then(() => {
      console.log(`Playlist ${sample.playlist_id} successfully added!`);
      res.status(300).send();
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
};

Playlist.getAllPlaylists = (req, res) => {
  return knex('playlists').select('*')
    .then(playlists => {
      res.status(200).send(playlists);
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
}

module.exports = Playlist;
