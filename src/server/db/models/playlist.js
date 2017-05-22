const knex = require('../db.js');
const shuffle = require('shuffle-array');
const Playlist = {};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Parse request query string
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

  // if country not available
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

  // if trend not available
  if(curatedPlaylists.length === 0) {
    curatedPlaylists = playlists;
  }
  return curatedPlaylists;
}

// makes use of 'shuffle-array' npm module
const randomizeTracks = function(tracks, randomizeTracks) {
  if(!randomizeTracks) return tracks;
  return shuffle(tracks);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read file 'routes.js' for details on how to use

// GET /playlist/info
Playlist.getPlaylist = function(req, res) {
  const max = 200;
  const min = 0; // not being used currently
  // parse query string
  const props = parseGetPlaylistReq(req, min, max);
  let randomize = false;
  if(props.random === true) randomize = true;
  console.log(props);

  // get all playlists from the database
  knex('playlists').select('*')
    .then(playlists => {
      console.log(`Retrieved ${playlists.length} playlists from database!`);
      // filter playlists
      let curatedPlaylists = playlists;
      curatedPlaylists = filterPlaylistsByCountries(curatedPlaylists, props.country);
      curatedPlaylists = filterPlaylistsByTrends(curatedPlaylists, props.trend);
      if(curatedPlaylists.length > 1) randomize = true;
      // create an array of tracks ids with no duplicates
      curatedTracks = curatedPlaylists.reduce((acc, playlist) => {
        return acc.concat(JSON.parse(playlist.playlist_tracks));
      }, []);
      curatedTracks = Array.from(new Set(curatedTracks));
      curatedTracks = randomizeTracks(curatedTracks, randomize);
      // TODO! check lower limit
      if(curatedTracks.length + 1 > props.limit) curatedTracks = curatedTracks.slice(0, props.limit);
      console.log(`Sending a list of ${curatedTracks.length} curated tracks!`);

      // get all tracks from the database included in the tracks array
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

// GET /playlist/info
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

//  Sample response for API calls:
//  {
//    playlist_id: '4LbFHmTvu6bQldLAiCQ8KG',
//    playlist_name: 'The Needle 20170518',
//    playlist_tracks: '["04fW4RG70p6uQD4fgd9maA", "06Q6ffj6cl2miQPSzylS6X", ... , "08wGol6j6NY9WlPXaD20Sb"]',
//    playlist_tracks_total: 300
//  }
