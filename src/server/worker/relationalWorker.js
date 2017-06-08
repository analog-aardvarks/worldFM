const request = require('request-promise-native');
const knex = require('../db/db');
const playlistData = require('./playlistData.js');
const playlistIndexData = require('./playlistIndexData.js');
const playlistExceptions = require('./playlistExceptions.js');
const config = require('../../../config');
const availableCountries = require('../data/availableCountries');
const abbreviation = require('../data/abbreviation');

const TRACK_DEBUG = true;
const startingTime = Date.now();
const owner = 'thesoundsofspotify';
const maxTracksPerPlaylist = 2000;

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
    console.log('PLAYLIST: ', playlist)
    knex('playlist')
    .where('id', playlist.id)
    .del()
    .then(() => {
      knex('playlist')
      .insert(playlist)
      .then(() => {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log(`[${Date.now() - startingTime}ms] SAVED PLAYLIST ${playlist.name}`);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        resolve();
      })
      .catch(err => reject(err));
    })
    .catch(err => reject(err));
  });

const mapTracksToPlaylist = (tracks, playlist) => {
  knex('playlist_track').where('playlist', playlist.id).del()
  .then(() => {
    tracks.forEach((track) => {
      knex('playlist_track')
      .insert({ track: track.id, playlist: playlist.id })
      .catch(err => console.log(err));
    });
  });
};

const mapPlaylistToCountry = (tracks, playlist) => {
  let country;
  for (let i = 0; i < availableCountries.length; i++) {
    country = availableCountries[i];
    // Start checking playlist names from several characters in
    // to avoid tagging CITY as Italy and COUNTRY as Colombia
    if (playlist.name.substring(6).includes(country)
      || playlist.name.substring(6).includes(abbreviation[country])) {
      // Patch for India/Indiana
      if (country === 'India' && playlist.name.includes('Indiana')) continue;
      let addCount = 0;
      let dupeCount = 0;
      tracks.forEach((t) => {
        knex('track_country')
        .insert({ track: t.id, country })
        .then(() => addCount++)
        .catch(() => dupeCount++);
      });
      knex('playlist_country').insert({ playlist: playlist.id, country })
      .then(() => console.log(`${playlist.name} mapped to ${country}.`))
      .catch(err => console.log(err));
      return;
    }
  }
};

const saveTrackInDatabase = track =>
  new Promise((resolve, reject) => {
    knex('track')
    .where('id', track.id)
    .then((res) => {
      if (res.length === 0) {
        knex('track')
        .insert(track)
        .then(() => {
          if (TRACK_DEBUG) console.log(`[${Date.now() - startingTime}ms] SAVED TRACK ${track.name}`);
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
    .then((token) => {
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
            id: t.id,
            artist_id: JSON.stringify(t.artists.map(artist => artist.id)),
            artist_name: JSON.stringify(t.artists.map(artist => artist.name)),
            name: t.name,
            preview_url: t.preview_url !== undefined ? t.preview_url : null,
            album_id: t.album.id,
            album_name: t.album.name,
            album_type: t.album.type,
            album_image: t.album.images[0] !== undefined ? t.album.images[0].url : null,
            popularity: t.popularity,
            length: t.duration_ms,
            position: t.track_number,
          };
        });
      })
      .then(res =>
        res.filter(t => t !== null && t.track_album_image !== null && t.preview_url !== null))
      .then(res => resolve(res))
      .catch(err => reject(err));
    })
    .catch(err => reject(err));
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
    .then((tracks) => {
      savePlaylistInDatabase({
        id: playlist.id,
        name: playlist.name,
        // tracks: JSON.stringify(tracks.map(t => t.track_id)),
      })
      .then(() => {
        mapTracksToPlaylist(tracks, playlist);
        mapPlaylistToCountry(tracks, playlist);
        const saveTrackInDatabasePromises = [];
        tracks.forEach(t => saveTrackInDatabasePromises.push(saveTrackInDatabaseGenerator(t)));
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
      let save = true;
      playlistExceptions.forEach((exception) => {
        if (playlist.name.includes(exception)) {
          save = false;
        }
      });
      if (save) {
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
getMultiplePlaylists(playlistData.splice(3000, 500))
.then(() => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log(`[${Date.now() - startingTime}ms] WORKER SUCCESSFUL!`);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
})
.catch(err => console.log(err));

// console.log(playlistData.length)
