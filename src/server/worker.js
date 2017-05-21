const SpotifyWebApi = require('spotify-web-api-node');
const Track = require('./db/models/Track.js');
const Playlist = require('./db/models/Playlist.js');
const config = require('../../config');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
});
spotifyApi.setAccessToken(config.token);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
            // save data!
            // console.log(parsedTrackData)
            Track.postTrack(parsedTrackData);
          })
          return tracksArray;
        })
        .then(tracksArray => {
           const parsedPlaylistData = parsePlaylistData(playlistData, tracksArray);
           // console.log(parsedPlaylistData);
           // save data!
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

const runWorkers = function() {
  // attemps to get relevant playlists!
  spotifyWorker('thesoundsofspotify', 50,   0);
  spotifyWorker('thesoundsofspotify', 50,  50);
  spotifyWorker('thesoundsofspotify', 50, 100);
  spotifyWorker('thesoundsofspotify', 50, 150);
  spotifyWorker('thesoundsofspotify',  2, 200);

  // EXPERIMENTAL, attemps to get all 9000+ playlists!

  // for(var i = 0; i <= 10000; i += 50) {
  //   spotifyWorker('thesoundsofspotify', 50,   i);
  // }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Run!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// TESTS
// uncomment and include id, limit, offset
// spotifyWorker('thesoundsofspotify', 1, 0);

// WARNING! Hundreds of API calls, run with caution!
runWorkers();
