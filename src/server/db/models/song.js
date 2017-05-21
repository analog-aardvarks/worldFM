const knex = require('../db.js');
const Song = {};

// GET /song?id=3zT1inKSRDpJvkAXGV7fBd
Song.getSong = function(req, res) {
  const id = req.query.id;

  if(!id) {
    // return all songs
    knex('songs').select('*')
      .then(songs => res.status(200).send(songs))
      .catch(err => console.log(err));
  } else {

    // return one song
    knex('songs').where('track_id', id)
      .then(song => res.status(200).send(song))
      .catch(err => console.log(err));
  }
};

Song.addNewSong = function(song) {

  knex('songs').where('track_id', song.track_id)
    .then(data => {
      if(data.length > 0) {
        console.log('Song already exists!');
      } else {
        knex('songs').insert(song)
          .then(() => console.log(`Song ${song.track_id} successfully added!`))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};

module.exports = Song;

// const sample = {
//   track_id: '3zT1inKSRDpJvkAXGV7fB7',
//   track_name: 'Amar pelos Dois Doiser',
//   track_preview_url: 'https://p.scdn.co/mp3-preview/f1c38fd4fa160a628ecebb2446be9aef18280bd0?cid=8897482848704f2a8f8d7c79726a70d4',
//   track_album_id: '0GfYO21pue5u0sVEYk9HZO',
//   track_album_image: 'https://i.scdn.co/image/957ffcfe80acb7ff395fe5ce9cc42ad3be184d47',
//   track_artist_name: '["Salvador Sobral", "Leonidas Gómez"]',
//   track_playlist_id: '4LbFHmTvu6bQldLAiCQ8KF',
// }
