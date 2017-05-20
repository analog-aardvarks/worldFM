let db = require('./db.js');

let Song = {};

Song.addNewSong = (req, res) => {
  let song = 'test';        //test data
  let artist = 'Mr.Test';   //test data
  return db('songs').insert({songName: song, artistName: artist})
    .then(() => {
      res.status(201).send('song added!');
    })
    .catch((err) => {
      console.log('error adding song to db: ', err);
    });
};

Song.getAllSongs = (req, res) => {
  return db('songs').select('*')
    .then((songs) => {
      res.status(200).send(songs);
    })
    .catch((err) => {
      console.log('error getting songs from db: ', err);
    });
}


module.exports = Song;
