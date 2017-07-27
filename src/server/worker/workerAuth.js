const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request-promise-native');
const config = require('../../config');
const knex = require('./db/db');

const Track = require('./helpers/Track');
const Playlist = require('./helpers/Playlist');
const extraPlaylists = require('./data/extraPlaylists');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Instructions:
// Get your own token from https://developer.spotify.com/web-api/console/
// Add it to the config.js file as a property named 'token'

// Get auth token

let spotifyApi;

const getAuth = () =>
  new Promise((resolve, reject) => {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + (new Buffer(config.clientID + ':' + config.clientSecret).toString('base64')),
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };
    request.post(authOptions)
    .then((res) => {
      console.log('THIS IS THE RES RIGHT HERE: ', res)
      spotifyApi = new SpotifyWebApi({
        clientId: config.clientID,
        clientSecret: config.clientSecret,
      });
      spotifyApi.setAccessToken(res.access_token);
      resolve(spotifyApi);
    })
    .catch(err => reject(err));
  });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Probably unnecessary with some refactoring of the worker function
const promisifyGetPlaylist = (owner, id) =>
  new Promise((resolve, reject) => {
    spotifyApi.getPlaylist(owner, id)
      .then((data) => {
        resolve(data.body.tracks.items);
      })
      .catch((err) => {
        reject(err);
      });
  });

const promisifyGetPlaylistExtraData = (owner, id) =>
  new Promise((resolve, reject) => {
    spotifyApi.getPlaylist(owner, id)
      .then((data) => {
        resolve(data.body);
      })
      .catch((err) => {
        reject(err);
      });
  });

// Parse raw data to be in line with schema structure
const parseTrackData = trackData => ({
  track_id: trackData.track.id,
  track_artist_id: JSON.stringify(trackData.track.artists.map(artist => artist.id)),
  track_artist_name: JSON.stringify(trackData.track.artists.map(artist => artist.name)),
  track_name: trackData.track.name,
  track_preview_url: trackData.track.preview_url,
  track_album_id: trackData.track.album.id,
  track_album_type: trackData.track.album.album_type,
  track_album_image: trackData.track.album.images[0].url,
  track_available_markets: JSON.stringify(trackData.track.available_markets),
  track_popularity: trackData.track.popularity,
  track_length: trackData.track.duration_ms,
  track_position: trackData.track.disc_number,
});

// Parse raw data to be in line with schema structure
const parsePlaylistData = (playlistData, tracksArray) => ({
  playlist_id: playlistData.id,
  playlist_name: playlistData.name,
  playlist_tracks: JSON.stringify(tracksArray),
  playlist_tracks_total: tracksArray.length,
});

const parsePlaylistDataExtra = (playlistData, tracksArray, country) => ({
  playlist_id: playlistData.id,
  playlist_name: `${country} : ${playlistData.name}`,
  playlist_tracks: JSON.stringify(tracksArray),
  playlist_tracks_total: tracksArray.length,
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Worker
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read 'Run' for details

const spotifyWorker = (owner, limit, offset) => {
  console.log('WOKER ENGAGE! spotifyApi: ', spotifyApi)
  spotifyApi.getUserPlaylists(owner, { limit, offset })
    .then((data) => {
      data.body.items.forEach((playlistData) => {
        const p = promisifyGetPlaylist(owner, playlistData.id);
        p.then((tracksData) => {
          const tracksArray = [];
          tracksData.forEach((singleTrackData) => {
            tracksArray.push(singleTrackData.track.id);
            const parsedTrackData = parseTrackData(singleTrackData);
            // Save track in database
            Track.postTrack(parsedTrackData);
          });
          return tracksArray;
        })
        .then((tracksArray) => {
          const parsedPlaylistData = parsePlaylistData(playlistData, tracksArray);
          // Save playlist in database
          Playlist.postPlaylist(parsedPlaylistData);
        })
        .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read 'Run' for details


const runExtraWorker = () => {
  Object.keys(extraPlaylists).forEach((country) => {
    extraPlaylists[country].forEach((uri) => {
      // console.log(`${country}: ${uri}`);
      const uriArray = uri.split(':');
      const owner = uriArray[2];
      const id = uriArray[4];
      // console.log(`${country}: ${owner}: ${id}`);
      const p = promisifyGetPlaylistExtraData(owner, id);
      p.then((data) => {
        const tracksData = data.tracks.items;
        const tracksArray = [];
        tracksData.forEach((singleTrackData) => {
          // console.log(singleTrackData)
          // console.log('!?!', singleTrackData.track.album.images.length);
          if (singleTrackData.track.album.images.length > 0) {
            tracksArray.push(singleTrackData.track.id);
            const parsedTrackData = parseTrackData(singleTrackData);
            // console.log(parsedTrackData);
            Track.postTrack(parsedTrackData);
          }
        });
        return [tracksArray, data];
      })
      .then((tracksTuple) => {
        const parsedPlaylistData = parsePlaylistDataExtra(tracksTuple[1], tracksTuple[0], country);
        // console.log(parsedPlaylistData);
        Playlist.postPlaylist(parsedPlaylistData);
      })
      .catch(err => console.log(err));
    });
  });
};

const runWorkers = () => {
  getAuth().then((spotifyApi) => {
    // spotifyWorker('thesoundsofspotify', 50, 850);
    // spotifyWorker('thesoundsofspotify', 50, 900);
    spotifyWorker('thesoundsofspotify', 50, 950);
    // spotifyWorker('thesoundsofspotify', 50, 150);
    // spotifyWorker('thesoundsofspotify', 2, 200);
    // runExtraWorker();
  })
  .catch(err => console.log(err));

  // EXPERIMENTAL! (not tested)
  // Attemps to get all 9928 playlists from user 'thesoundsofspotify'
  // Thousands of API calls, exceeds current call limit

  // for(var i = 0; i <= 10000; i += 50) {
  //   spotifyWorker('thesoundsofspotify', 50, i);
  // }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Run!
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Worker function:
// Gets a number of playlists created by specified user, then attemps to save it in database
// Then iterates through the first 100 songs in the playlist and attemps to save them in database
// Params: owner, limit, offset

// const owner = 'thesoundsofspotify';
// const limit = 5;
// const offset = 0
// spotifyWorker('thesoundsofspotify', 1, 0);

// Run function:
// Attemps to get the first 202 playlists from user 'thesoundsofspotify'
// WARNING! Hundreds of API calls, run with caution as call limit can be reached fast

runWorkers();
// runExtraWorker();
// Object.keys(extraPlaylists).forEach((country) => {
//   knex('playliststest')
//   .where('playlist_name', `${country} : Metal & Rock`)
//   .del()
//   .then(data => console.log(data));
// });

// spotifyApi.getPlaylist('thelinmichael', '5ieJqeLJjjI8iJWaxeBLuK')
//   .then(function(data) {
//     console.log('Some information about this playlist', data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });
