const knex = require('../db/db');
const Track = {};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read file 'routes.js' for details on how to use

// GET /track
Track.getTrack = function(req, res) {
  const id = req.query.id;
  if(!id) {
    // return all tracks
    knex('tracks').select('*')
      .then(tracks => res.status(200).send(tracks))
      .catch(err => console.log(err));
  } else {
    // return one track
    knex('tracks').where('track_id', id)
      .then(track => res.status(200).send(track))
      .catch(err => console.log(err));
  }
};

// GET /track/length
Track.getTrackLength = function(req, res) {
  knex('tracks').select('*')
    .then(tracks => res.status(200).send([tracks.length]))
    .catch(err => console.log(err));
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Track.postTrack = function(track) {
  knex('tracks').where('track_id', track.track_id)
    .then(data => {
      if(data.length > 0) {
        console.log('Track already exists!');
      } else {
        knex('tracks').insert(track)
          .then(() => console.log(`Track ${track.track_name} successfully added!`))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};

module.exports = Track;

// Sample response for API calls:
// {
//   track_id: '3zT1inKSRDpJvkAXGV7fB7',
//   track_name: 'Amar pelos Dois Doiser',
//   track_preview_url: 'https://p.scdn.co/mp3-preview/f1c38fd4fa160a628ecebb2446be9aef18280bd0?cid=8897482848704f2a8f8d7c79726a70d4',
//   track_album_id: '0GfYO21pue5u0sVEYk9HZO',
//   track_album_image: 'https://i.scdn.co/image/957ffcfe80acb7ff395fe5ce9cc42ad3be184d47',
//   track_artist_name: '["Salvador Sobral", "Leonidas Gómez"]'
// }
