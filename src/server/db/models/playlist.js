let db = require('./db.js');

let Playlist = {};

Playlist.addNewPlaylist = function(req, res) {
  let name = 'test1';        //test data
  let playlistId = '123';      //test data
  let tracks = 4;            //test data
  return db('playlists').insert({
      name: name,
      playlistId: playlistId,
      tracks: tracks
    })
    .then(() => {
      res.status(201).send('playlist added!');
    })
    .catch((err) => {
      console.log('error adding playlist to db: ', err);
    });
};

Playlist.getAllPlaylists = (req, res) => {
  return db('playlists').select('*')
    .then((playlists) => {
      res.status(200).send(playlists);
    })
    .catch((err) => {
      console.log('error getting playlists from db: ', err);
    });
}


module.exports = Playlist;
