const knex = require('../db/db');
const _ = require('underscore');

const abbreviation = require('../data/abbreviation');

const Playlist = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Parse request query string
const parseGetPlaylistReq = (req, min, max) => {
  const props = {
    country: req.query.country ? req.query.country.split(',') : null,
    trend: req.query.trend ? req.query.trend.split(',') : null,
    random: req.query.random || null,
    limit: parseInt(req.query.limit, 10) || 100,
  };
  if (props.random === 'true') props.random = true;
  if (props.limit < min) props.limit = min;
  if (props.limit > max) props.limit = max;
  return props;
};

const filterPlaylistsWorldMix = (playlists) => {
  // the Needle
  const curatedPlaylists = playlists.filter(playlist => playlist.playlist_name.includes('The Needle') && !playlist.playlist_name.includes('/'));
  // log the names
  curatedPlaylists.forEach(playlist => console.log(playlist.playlist_name));
  return curatedPlaylists;
};

const filterPlaylistsByCountries = (playlists, countries) => {
  if (countries === null || countries[0] === 'World') return filterPlaylistsWorldMix(playlists);
  let curatedPlaylists = [];
  countries.forEach((country) => {
    const abb = abbreviation[country];
    // console.log(abb);
    const matchingPlaylists = playlists.filter((playlist) => {
      // india bug fix!
      if (country === 'India' && playlist.playlist_name.includes('Indiana')) return false;
      return playlist.playlist_name.includes(country) || playlist.playlist_name.includes(abb);
    });
    curatedPlaylists = curatedPlaylists.concat(matchingPlaylists);
  });

  // if country not available
  if (curatedPlaylists.length === 0) {
    curatedPlaylists = filterPlaylistsWorldMix(playlists);
  }

  // log the names
  curatedPlaylists.forEach(playlist => console.log(playlist.playlist_name));
  return curatedPlaylists;
};

const filterPlaylistsByTrends = (playlists, trends) => {
  if (trends === null) return playlists;
  let curatedPlaylists = [];
  trends.forEach((trend) => {
    const matchingPlaylists = playlists.filter(playlist => playlist.playlist_name.includes(trend));
    curatedPlaylists = curatedPlaylists.concat(matchingPlaylists);
  });
  // if trend not available
  if (curatedPlaylists.length === 0) {
    curatedPlaylists = playlists;
  }
  return curatedPlaylists;
};

// const randomizeTracks = (tracks, shouldRandomize) => {
//   if (shouldRandomize === false) return tracks;
//   return _.shuffle(tracks);
// };

const makeSureWeCanPlayTheTracks = (tracks) => {
  const original = tracks.length;
  // console.log('<82> ORIGINAL -> ', tracks.length);
  const curatedTracks = _.filter(tracks, (track) => {
    const hasPreviewURL = track.track_preview_url !== null;
    let isAvailableInTheUS;
    if (track.track_available_markets[track.track_available_markets.length - 1] === ']') {
      isAvailableInTheUS = JSON.parse(track.track_available_markets).includes('US');
    } else {
      isAvailableInTheUS = false;
    }
    return hasPreviewURL && isAvailableInTheUS;
  });
  // console.log('<88> FILTER -> ', curatedTracks.length);
  return curatedTracks;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read file 'routes.js' for details on how to use

// GET /playlist/info
Playlist.getPlaylist = (req, res) => {
  const max = 200;
  const min = 0; // not being used currently
  // parse query string
  const props = parseGetPlaylistReq(req, min, max);
  // let randomize = false;
  // if (props.random === true) randomize = true;
  console.log(`Country: ${props.country}, Trend: ${props.trend}, Limit: ${props.limit}, Random: ${props.random}`);

  // get all playlists from the database
  knex('playlists').select('*')
    .then((playlists) => {
      console.log(`Retrieved ${playlists.length} playlists from database!`);
      // filter playlists
      let curatedPlaylists = playlists;
      curatedPlaylists = filterPlaylistsByCountries(curatedPlaylists, props.country);
      curatedPlaylists = filterPlaylistsByTrends(curatedPlaylists, props.trend);

      // if (curatedPlaylists.length > 1) randomize = true;
      // create an array of tracks ids with no duplicates
      let curatedTracks = curatedPlaylists.reduce((acc, playlist) =>
         acc.concat(JSON.parse(playlist.playlist_tracks)), []);
      curatedTracks = Array.from(new Set(curatedTracks));
      // curatedTracks = makeSureWeCanPlayTheTracks(curatedTracks);
      // TODO! check lower limit
      // console.log(curatedTracks.length, _.uniq(curatedTracks).length)

      console.log(`Sending a list of ${curatedTracks.length} curated tracks!`);

      // get all tracks from the database included in the tracks array
      knex('tracks')
        .groupBy('track_id') // removes duplicate id's (not necessary in theory, yet it is)
        .whereIn('track_id', curatedTracks)
        .then((data) => {
          data = makeSureWeCanPlayTheTracks(data);
          data = _.shuffle(data);
          if (data.length + 1 > props.limit) data = data.slice(0, props.limit);
          res.status(200).send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send('Something went wrong!', err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send('Something went wrong!', err);
    });
};

// GET /playlist/info
Playlist.getPlaylistInfo = (req, res) => {
  const id = req.query.id;
  if (!id) {
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

// GET /playlist/length
Playlist.getPlaylistLength = (req, res) => {
  knex('playlists').select('*')
    .then(playlist => res.status(200).send([playlist.length]))
    .catch(err => console.log(err));
};

Playlist.getPlaylistNames = (req, res) => {
  knex('playlists').select('*')
    .then((playlist) => {
      let s = '';
      _.each(playlist, (p) => {
        s += p.playlist_name;
        s += '\n';
      });
      res.status(200).send(s);
    })
    .catch(err => console.log(err));
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Playlist.postPlaylist = (playlist) => {
  knex('playlists').where('playlist_id', playlist.playlist_id)
    .then((data) => {
      if (data.length > 0) {
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
//    playlist_tracks: '["04fW4RG70p6uQD4fgd9maA", "06Q6ffj6cl2miQPSzylS6X", ...]',
//    playlist_tracks_total: 300
//  }
