const request = require('request-promise-native');
const knex = require('../db/db');
const playlistData = require('./playlistData.js');
const playlistIndexData = require('./playlistIndexData.js');
const playlistExceptions = require('./playlistExceptions.js');
const config = require('../../../config');

const TRACK_DEBUG = true;
const startingTime = Date.now();
const owner = 'thesoundsofspotify';
const maxTracksPerPlaylist = 200;

const getAuth = () =>
  new Promise((resolve, reject) => {
    const options = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { Authorization: 'Basic ' + (new Buffer(config.clientID + ':' + config.clientSecret).toString('base64')) },
      form: { grant_type: 'client_credentials' },
      json: true,
    };
    request.post(options)
    .then((res) => {
      resolve(res.access_token);
    })
    .catch(err => reject(err));
  });


const savePlaylistInDatabase = playlist =>
  new Promise((resolve, reject) => {
    knex('playlists')
    .where('playlist_id', playlist.playlist_id)
    .del()
    .then(() => {
      knex('playlists')
      .insert(playlist)
      .then(() => {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log(`[${Date.now() - startingTime}ms] SAVED PLAYLIST ${playlist.playlist_name}`);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        resolve();
      })
      .catch(err => reject(err));
    })
    .catch(err => reject(err));
  });

const saveTrackInDatabase = track =>
  new Promise((resolve, reject) => {
    knex('tracks')
    .where('track_id', track.track_id)
    .then((res) => {
      if (res.length === 0) {
        knex('tracks')
        .insert(track)
        .then(() => {
          if (TRACK_DEBUG) console.log(`[${Date.now() - startingTime}ms] SAVED TRACK ${track.track_name}`);
          resolve();
        })
        .catch(err => reject(err));
      } else {
        // if (TRACK_DEBUG) console.log(`[${Date.now() - startingTime}ms] TRACK ALREADY IN DATABASE`);
        resolve();
      }
    })
    .catch(err => reject(err));
  });

const saveTrackInDatabaseGenerator = track => () => saveTrackInDatabase(track);

const getPlaylistTrackData = (id, offset, limit) =>
  new Promise((resolve, reject) => {
    getAuth()
    .then(token => {
      const fields = 'items(track(album(type,name,id,images),artists(name,id),available_markets,duration_ms,name,id,preview_url,track_number,popularity))';
      request(`https://api.spotify.com/v1/users/${owner}/playlists/${id}/tracks?fields=${fields}&limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => JSON.parse(res))
      .then(res => res.items)
      .then(res => res.map(t => t.track))
      .then((res) => {
        return res.map((t) => {
          if (t === null) return null;
          else if (!t.available_markets.includes('US')) return null;
          return {
            track_id: t.id,
            track_artist_id: JSON.stringify(t.artists.map(artist => artist.id)),
            track_artist_name: JSON.stringify(t.artists.map(artist => artist.name)),
            track_name: t.name,
            track_preview_url: t.preview_url !== undefined ? t.preview_url : null,
            track_album_id: t.album.id,
            track_album_name: t.album.name,
            track_album_type: t.album.type,
            track_album_image: t.album.images[0] !== undefined ? t.album.images[0].url : null,
            track_popularity: t.popularity,
            track_length: t.duration_ms,
            track_position: t.track_number,
          };
        });
      })
      .then(res =>
        res.filter(t => t !== null && t.track_album_image !== null && t.preview_url !== null))
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
    .catch(err => console.log(err));
  });

const getPlaylistTrackDataGenerator = (id, offset) => () => getPlaylistTrackData(id, offset, 100);

const getAllPlaylistTrackData = playlist =>
  new Promise((resolve, reject) => {
    const getPlaylistTrackDataPromises = [];
    for (let i = 0; i < playlist.total; i += 100) {
      getPlaylistTrackDataPromises.push(getPlaylistTrackDataGenerator(playlist.id, i));
    }

    const serial = funcs =>
      funcs.reduce((promise, func) =>
        promise.then(result =>
          func().then(Array.prototype.concat.bind(result))), Promise.resolve([]));

    serial(getPlaylistTrackDataPromises)
    .then(res => res.sort((a, b) => b.track_popularity - a.track_popularity))
    .then(res => resolve(res))
    .catch(err => reject(err));
  });

const getAndSavePlaylist = playlist =>
  new Promise((resolve, reject) => {
    getAllPlaylistTrackData(playlist)
    .then(res => res.splice(0, maxTracksPerPlaylist))
    .then((data) => {
      savePlaylistInDatabase({
        playlist_id: playlist.id,
        playlist_name: playlist.name,
        playlist_tracks: JSON.stringify(data.map(t => t.track_id)),
        playlist_tracks_total: data.length,
      })
      .then(() => {
        const saveTrackInDatabasePromises = [];
        data.forEach(t => saveTrackInDatabasePromises.push(saveTrackInDatabaseGenerator(t)));
        saveTrackInDatabasePromises.push(resolve);
        saveTrackInDatabasePromises.reduce((acc, fn) => acc.then(fn), Promise.resolve());
      })
      .catch(err => reject(err));
    })
    .catch(err => reject(err));
  });

const getAndSavePlaylistGenerator = playlist => () => getAndSavePlaylist(playlist);

const getMultiplePlaylists = playlistBatch =>
  new Promise((resolve) => {
    const getAndSavePlaylistPromises = [];
    playlistBatch.forEach((playlist) => {
      if (!playlistExceptions.includes(playlist.name)) {
        getAndSavePlaylistPromises.push(getAndSavePlaylistGenerator(playlist));
      }
    });
    getAndSavePlaylistPromises.push(resolve);
    getAndSavePlaylistPromises.reduce((acc, fn) => acc.then(fn), Promise.resolve());
  });

// GET RANGE
// getMultiplePlaylists(playlistData.splice(550, 3))
// .then(() => {
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//   console.log(`[${Date.now() - startingTime}ms] WORKER SUCCESSFUL!`);
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
// })
// .catch(err => console.log(err));

// GET COUNTRIES
// getMultiplePlaylists(playlistData.splice(0, playlistIndexData.endingIndexCountries - 1))
// .then(() => {
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//   console.log(`[${Date.now() - startingTime}ms] WORKER SUCCESSFUL!`);
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
// })
// .catch(err => console.log(err));

// GET CITIES
// getMultiplePlaylists(
//   playlistData.splice(
//     playlistIndexData.startingIndexCities - 1, playlistIndexData.endingIndexCities - 1))
// .then(() => {
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//   console.log(`[${Date.now() - startingTime}ms] WORKER SUCCESSFUL!`);
//   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
// })
// .catch(err => console.log(err));

// GET GENRES
getMultiplePlaylists(playlistData.splice(4489))
.then(() => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log(`[${Date.now() - startingTime}ms] WORKER SUCCESSFUL!`);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
})
.catch(err => console.log(err));
