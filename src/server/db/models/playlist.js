const knex = require('../db.js');
const shuffle = require('shuffle-array');
const Playlist = {};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const parseGetPlaylistReq = function(req, min, max) {
  const props = {
    country: req.query.country ? req.query.country.split(',') : null,
    trend: req.query.trend ? req.query.trend.split(',') : null,
    random: req.query.random || null,
    limit: parseInt(req.query.limit) || 100,
  }
  if(props.random === "true") props.random = true;
  if(props.limit < min) props.limit = min;
  if(props.limit > max) props.limit = max;
  return props;
}

const filterPlaylistsWorldMix = function(playlists) {
  return playlists.filter(playlist => !playlist.playlist_name.includes('/'));
}

const filterPlaylistsByCountries = function(playlists, countries) {
  if(countries === null) return filterPlaylistsWorldMix(playlists);
  let curatedPlaylists = [];

  countries.forEach(country => {
    const matchingPlaylists = playlists.filter(playlist => playlist.playlist_name.includes(country));
    curatedPlaylists = curatedPlaylists.concat(matchingPlaylists);
  });

  // country not available!
  if(curatedPlaylists.length === 0) {
    curatedPlaylists = filterPlaylistsWorldMix(playlists);
  }
  return curatedPlaylists;
}

const filterPlaylistsByTrends = function(playlists, trends) {
  if(trends === null) return playlists;
  let curatedPlaylists = [];

  trends.forEach(trend => {
    const matchingPlaylists = playlists.filter(playlist => playlist.playlist_name.includes(trend));
    curatedPlaylists = curatedPlaylists.concat(matchingPlaylists);
  })

  // trend not available!
  if(curatedPlaylists.length === 0) {
    curatedPlaylists = playlists;
  }
  return curatedPlaylists;
}

const randomizeTracks = function(tracks, randomizeTracks) {
  if(!randomizeTracks) return tracks;
  return shuffle(tracks);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Playlist.getPlaylist = function(req, res) {
  const max = 200;
  const min = 0;
  // parse query data
  const props = parseGetPlaylistReq(req, min, max);
  let randomize = false;
  if(props.random === true) randomize = true;
  console.log(props);

  // get all playlist from database
  knex('playlists').select('*')
    .then(playlists => {
      console.log(`Retrieved ${playlists.length} playlists from database!`);
      let curatedPlaylists = playlists;
      // filter by country
      curatedPlaylists = filterPlaylistsByCountries(curatedPlaylists, props.country);
      // filter by trend
      curatedPlaylists = filterPlaylistsByTrends(curatedPlaylists, props.trend);

      // check if we should randomize
      if(curatedPlaylists.length > 1) randomize = true;

      // get track mix!
      curatedTracks = curatedPlaylists.reduce((acc, playlist) => {
        return acc.concat(JSON.parse(playlist.playlist_tracks));
      }, []);

      // remove duplicates
      curatedTracks = Array.from(new Set(curatedTracks));

      // randomize list if necessary
      curatedTracks = randomizeTracks(curatedTracks, randomize);

      // TODO! check lower limit
      // check upper limit
      if(curatedTracks.length + 1 > props.limit) curatedTracks = curatedTracks.slice(0, props.limit);
      console.log(`Sending a list of ${curatedTracks.length} curated tracks!`);

      // query database for curatedTracks
      knex('tracks')
        .groupBy('track_id') // removes duplicate id's (not necessary in theory but still...)
        .whereIn('track_id', curatedTracks)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          console.log(err);
          res.status(404).send('Something went wrong!', err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('Something went wrong!', err);
    });
}

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
