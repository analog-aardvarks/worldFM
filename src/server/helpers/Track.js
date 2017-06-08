const knex = require('../db/db');

const Track = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read file 'routes.js' for details on how to use

Track.mapToTrackObj = knex.raw(`track.id as track_id,
                track.name as track_name,
                track.album_id as track_album_id,
                track.album_image as track_album_image,
                track.album_name as track_album_name,
                track.album_type as track_album_type,
                track.artist_id as track_artist_id,
                track.artist_name as track_artist_name,
                track.length as track_length,
                track.popularity as track_popularity,
                track.position as track_position,
                track.preview_url as track_preview_url,
                GROUP_CONCAT(DISTINCT track_country.country SEPARATOR ', ') as track_countries
                `);

// Track.genreTrackObj = knex.raw(`
//                 track.id as track_id,
//                 track.name as track_name,
//                 track.album_id as track_album_id,
//                 track.album_image as track_album_image,
//                 track.album_name as track_album_name,
//                 track.album_type as track_album_type,
//                 track.artist_id as track_artist_id,
//                 track.artist_name as track_artist_name,
//                 track.length as track_length,
//                 track.popularity as track_popularity,
//                 track.position as track_position,
//                 track.preview_url as track_preview_url
//                 `);


// GET /track
Track.getTrack = (req, res) => {
  const id = req.query.id;
  if (!id) {
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
Track.getTrackLength = (req, res) => {
  knex('tracks').count('*')
    .then(count => res.status(200).send(count))
    .catch(err => console.log(err));
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Track.postTrack = (track) => {
  knex('tracks').where('track_id', track.track_id)
    .then((data) => {
      if (data.length > 0) {
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
