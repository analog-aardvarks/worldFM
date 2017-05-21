const knex = require('../db.js');
const Playlist = {};

// GET /playlist?id=3zT1inKSRDpJvkAXGV7fBd
Playlist.getPlaylistInfo = function(req, res) {
  const id = req.query.id;

  if(!id) {
    // return all playlists
    knex('playlists').select('*')
      .then(playlists => res.status(200).send(playlists))
      .catch(err => console.log(err));
  } else {

    // return one playlist
    knex('playlists').where('playlist_id', id)
      .then(playlist => res.status(200).send(playlist))
      .catch(err => console.log(err));
  }
};

Playlist.postPlaylist = function(playlist) {

  knex('playlists').where('playlist_id', playlist.playlist_id)
    .then(data => {
      if(data.length > 0) {
        console.log('Playlist already exists!');
      } else {
        knex('playlists').insert(playlist)
          .then(() => console.log(`Playlist ${playlist.playlist_name} successfully added!`))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};

module.exports = Playlist;

// const sample = {
//   playlist_id: '4LbFHmTvu6bQldLAiCQ8KG',
//   playlist_name: 'The Needle 20170518',
//   playlist_tracks_total: 300,
// }
// Playlist.postPlaylist(sample);
