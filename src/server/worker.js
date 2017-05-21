const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../../config');

const Track = require('./db/models/Track.js');
const Playlist = require('./db/models/Playlist.js');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Instructions:
// Get your own token from https://developer.spotify.com/web-api/console/
// Add it to the config.js file as a property named 'token'
const spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
});
spotifyApi.setAccessToken(config.token);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Probably unnecessary with some refactoring of the worker function
const promisifyGetPlaylist = function(owner, id) {
  return new Promise((resolve, reject) => {
    spotifyApi.getPlaylist(owner, id)
      .then(function(data) {
        resolve(data.body.tracks.items);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

// Parse raw data to be in line with schema structure
const parseTrackData = function(trackData) {
  return {
    track_id: trackData.track.id,
    track_name: trackData.track.name,
    track_preview_url: trackData.track.preview_url,
    track_album_id: trackData.track.album.id,
    track_album_image: trackData.track.album.images[0].url,
    track_artist_name: trackData.track.artists[0].name,
  }
}

// Parse raw data to be in line with schema structure
const parsePlaylistData = function(playlistData, tracksArray) {
  return {
    playlist_id: playlistData.id,
    playlist_name: playlistData.name,
    playlist_tracks: JSON.stringify(tracksArray),
    playlist_tracks_total: tracksArray.length,
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Worker
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read 'Run' for details

const spotifyWorker = function(owner, limit, offset) {
  spotifyApi.getUserPlaylists(owner, { limit: limit, offset: offset })
    .then(data => {
      data.body.items.forEach(playlistData => {
        const p = promisifyGetPlaylist(owner, playlistData.id);
        p.then(tracksData => {
          const tracksArray = [];
          tracksData.forEach(singleTrackData => {
            tracksArray.push(singleTrackData.track.id);
            const parsedTrackData = parseTrackData(singleTrackData);
            // Save track in database
            Track.postTrack(parsedTrackData);
          })
          return tracksArray;
        })
        .then(tracksArray => {
           const parsedPlaylistData = parsePlaylistData(playlistData, tracksArray);
           // Save playlist in database
           Playlist.postPlaylist(parsedPlaylistData);
        })
        .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Read 'Run' for details

const runWorkers = function() {
  spotifyWorker('thesoundsofspotify', 50,   0);
  spotifyWorker('thesoundsofspotify', 50,  50);
  spotifyWorker('thesoundsofspotify', 50, 100);
  spotifyWorker('thesoundsofspotify', 50, 150);
  spotifyWorker('thesoundsofspotify',  2, 200);

  // EXPERIMENTAL! (not tested)
  // Attemps to get all 9928 playlists from user 'thesoundsofspotify'
  // Thousands of API calls, exceeds current call limit

  // for(var i = 0; i <= 10000; i += 50) {
  //   spotifyWorker('thesoundsofspotify', 50, i);
  // }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Run!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// runWorkers();
