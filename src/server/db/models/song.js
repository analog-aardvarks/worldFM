const knex = require('../db.js');
const Song = {};
Song.addNewSong = (req, res) => {

  const sample = {
    track_id: '3zT1inKSRDpJvkAXGV7fBd',
    track_name: 'Amar pelos Dois',
    track_preview_url: 'https://p.scdn.co/mp3-preview/f1c38fd4fa160a628ecebb2446be9aef18280bd0?cid=8897482848704f2a8f8d7c79726a70d4',
    //track_popularity: '71',
    track_album_id: '0GfYO21pue5u0sVEYk9HZO',
    track_album_image: 'https://i.scdn.co/image/957ffcfe80acb7ff395fe5ce9cc42ad3be184d47',
    track_artist_name: '["Salvador Sobral", "Leonidas Gómez"]',
    track_playlist_id: '4LbFHmTvu6bQldLAiCQ8KF',
  }

  return knex('songs').insert(sample)
    .then(() => {
      console.log(`Song ${sample.track_id} successfully added!`);
      res.status(300).send();
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
};

Song.getAllSongs = (req, res) => {
  return knex('songs').select('*')
    .then(songs => {
      res.status(200).send(songs);
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
}

module.exports = Song;
