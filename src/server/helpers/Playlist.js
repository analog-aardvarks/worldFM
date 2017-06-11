const knex = require('../db/db');
const request = require('request-promise-native');
const _ = require('underscore');
const User = require('./User');
const Track = require('./Track');

// Set length of playlist
const limit = 100;

// Initialize 'World' playlist for faster page load
let worldPlaylist;
const updateWorldPlaylist = () => {
  console.log('Creating world playlist...');
  const startTime = Date.now();
  knex('track')
  .select(Track.mapToTrackObj)
  .join('playlist_track', 'playlist_track.track', '=', 'track.id')
  .join('playlist', 'playlist.id', '=', 'playlist_track.playlist')
  .join('playlist_country', 'playlist_country.playlist', '=', 'playlist.id')
  .join('track_country', 'track_country.track', '=', 'track.id')
  .groupBy('track.id')
  .orderBy(knex.raw('Rand()'))
  .limit(1000)
  .then((tracks) => { worldPlaylist = tracks; })
  .then(() => console.log(`World playlist loaded in ${Date.now() - startTime}ms`))
  .catch(err => console.log(err));
  // Update landing playlist every hour
  setTimeout(updateWorldPlaylist, 3600000);
};
updateWorldPlaylist();

User.getUser = user =>
  new Promise((resolve, reject) =>
    knex('user').where('id', user.id)
      .then((userData) => {
        if (userData.length > 0) resolve(userData[0]);
        else resolve(false);
      })
      .catch(err => reject(err)));

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

const removeAlbumDuplicates = (tracks) => {
  console.log(tracks.length);
  const albums = {};
  const curatedTracks = [];
  tracks.forEach((t) => {
    albums[t.track_album_id] = albums[t.track_album_id] + 1 || 1;
    if (albums[t.track_album_id] === 1) {
      curatedTracks.push(t);
    }
  });
  console.log('CURRENTLY CURRADTED: ', curatedTracks.length);
  return curatedTracks;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Endpoint
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const getGenrePlaylist = genre =>
  new Promise((resolve, reject) => {
    knex('playlist')
    .select(Track.mapToTrackObj)
    .join('playlist_track', 'playlist_track.playlist', '=', 'playlist.id')
    .join('track', 'track.id', '=', 'playlist_track.track')
    .leftJoin('track_country', 'track.id', '=', 'track_country.track')
    .where('playlist.name', 'like', `%${genre}`)
    .groupBy('track.id')
    .orderBy(knex.raw('Rand()'))
    .limit(limit)
    .then(playlist => resolve(playlist))
    .catch(err => reject(err));
  });

const getCountryPlaylist = country =>
  new Promise((resolve) => {
    if (country === 'World') {
      const playlist = _.shuffle(worldPlaylist).slice(0, 120);
      resolve(playlist);
    } else {
      knex('track')
      .select(Track.mapToTrackObj)
      .join('playlist_track', 'playlist_track.track', '=', 'track.id')
      .join('playlist', 'playlist.id', '=', 'playlist_track.playlist')
      .join('playlist_country', 'playlist_country.playlist', '=', 'playlist.id')
      .join('track_country', 'track_country.track', '=', 'track.id')
      .where('playlist_country.country', country)
      .groupBy('track.id')
      .orderBy(knex.raw('Rand()'))
      .limit(200)
      .then(tracks => resolve(tracks))
      .catch(err => console.log(err));
    }
  });

Playlist.getPlaylist = (req, res) => {
  const country = req.query.country;
  const genre = req.query.genre;
  if (genre === undefined) {
    getCountryPlaylist(country)
    .then(playlist => res.send(playlist))
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
  } else {
    getGenrePlaylist(genre)
    .then(data => removeAlbumDuplicates(data))
    .then(data => data.slice(0, 120))
    .then(data => res.status(200).send(data))
    .catch((err) => {
      res.status(500).send();
      console.log(err);
    });
  }
};

// GET /playlist/info
Playlist.getPlaylistInfo = (req, res) => {
  const id = req.query.id;
  if (!id) {
    // return all playlists
    knex('playliststest').select('*')
      .then(playlists => res.status(200).send(playlists))
      .catch(err => console.log(err));
  } else {
    // return one playlist
    knex('playliststest').where('playlist_id', id)
      .then(playlist => res.status(200).send(playlist))
      .catch(err => console.log(err));
  }
};

// GET /playlist/length
Playlist.getPlaylistLength = (req, res) => {
  knex('playliststest').select('*')
    .then(playlist => res.status(200).send([playlist.length]))
    .catch(err => console.log(err));
};

Playlist.getPlaylistNames = (req, res) => {
  knex('playliststest').select('*')
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
// Sync
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Playlist.sync = (user, favs) => {
  // AKA PROMISE HELL!
  const DEBUG_MODE = false;
  const TIME_START = Date.now();

  if (DEBUG_MODE) console.log(`223 [${Date.now() - TIME_START}ms] -> AUTHENTICATED!`);
  const userId = user.id;
  if (DEBUG_MODE) console.log(`225 [${Date.now() - TIME_START}ms] -> USER ID: ${userId}`);
  let tracks = favs;
  tracks = tracks.map(t => t.track_id);
  // console.log('Sync -> userId: ', userId);
  if (DEBUG_MODE) console.log(`229 [${Date.now() - TIME_START}ms] -> RECEIVED ${tracks.length} TRACKS!`);
  if (DEBUG_MODE) console.log(`230 [${Date.now() - TIME_START}ms] -> LOOKING FOR THE USER'S PLAYLIST ID IN THE DATABASE...`);
  User.getUser(user)
    .then(userData => userData.playlist)
    .then((userPlaylist) => {
      if (DEBUG_MODE) console.log(`235 [${Date.now() - TIME_START}ms] -> FOUND PLAYLIST ID ${userPlaylist} FOR USER ${userId}`);
      if (userPlaylist === null) {
        if (DEBUG_MODE) console.log(`237 [${Date.now() - TIME_START}ms] -> PLAYLIST DOESN'T EXISTS, CREATING ONE...`);
        request({
          method: 'POST',
          url: `https://api.spotify.com/v1/users/${userId}/playlists`,
          headers: { Authorization: `Bearer ${user.accessToken}` },
          body: JSON.stringify({
            name: 'World FM',
            description: 'Created with love, just for you!',
          }),
        })
          .then(newPlaylistData => JSON.parse(newPlaylistData))
          .then(parsedNewPlaylistData => parsedNewPlaylistData.id)
          .then((newPlaylistId) => {
            if (DEBUG_MODE) console.log(`250 [${Date.now() - TIME_START}ms] -> PLAYLIST CREATED WITH ID ${newPlaylistId}`);
            knex('user')
            .where('id', userId)
            .update({ playlist: newPlaylistId })
            .catch(err => console.log(err));
            if (DEBUG_MODE) console.log(`255 [${Date.now() - TIME_START}ms] -> SAVED PLAYLIST ${newPlaylistId} IN DATABASE!`);
            if (DEBUG_MODE) console.log(`256 [${Date.now() - TIME_START}ms] -> SYNCING PLAYLIST...`);
            const tracksToAdd = tracks.map(t => `spotify:track:${t}`);
            if (DEBUG_MODE) console.log(`258 [${Date.now() - TIME_START}ms] -> ADDING ${tracksToAdd.length} TRACKS TO PLAYLIST...`);
            const addP = [];
            for (let i = 0; i < tracksToAdd.length; i += 50) {
              if (DEBUG_MODE) console.log(`311 [${Date.now() - TIME_START}ms] -> CREATING ADD PROMISES, TRACKS ${i} - ${i + 50}`);
              addP.push(
                request({
                  method: 'POST',
                  url: `https://api.spotify.com/v1/users/${userId}/playlists/${newPlaylistId}/tracks`,
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                  body: JSON.stringify({ uris: tracksToAdd.slice(i, i + 50) }),
                }));
            }
            if (DEBUG_MODE) console.log(`270 [${Date.now() - TIME_START}ms] -> ABOUT TO START PROMISE ALL, ADDING TRACKS...`);
            Promise.all(addP)
            .then((addResponse) => {
              if (DEBUG_MODE) console.log(`273 [${Date.now() - TIME_START}ms] -> PROMISE ALL HAS ENDED! RESPONSE IS: ${addResponse}`);
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      } else {
        if (DEBUG_MODE) console.log(`280 [${Date.now() - TIME_START}ms] -> LOOKING FOR PLAYLIST ${userPlaylist} IN SPOTIFY...`);
        request({
          method: 'GET',
          url: `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })
        .then(userPlaylistsData => JSON.parse(userPlaylistsData))
        .then(parsedUserPlaylistsData => parsedUserPlaylistsData.items.map(i => i.id))
        .then(mappedUserPlaylistsData => _.contains(mappedUserPlaylistsData, userPlaylist))
        .then((playlistIsInSpotify) => {
          if (playlistIsInSpotify) {
            if (DEBUG_MODE) console.log(`291 [${Date.now() - TIME_START}ms] -> PLAYLIST WITH ID ${userPlaylist} FOUND IN SPOTIFY! `);
            if (DEBUG_MODE) console.log(`292 [${Date.now() - TIME_START}ms] -> SYNCING PLAYLIST...`);
            request({
              method: 'GET',
              url: `https://api.spotify.com/v1/users/${userId}/playlists/${userPlaylist}?fields=tracks(total)`,
              headers: { Authorization: `Bearer ${user.accessToken}` },
            })
            .then(playlistData => JSON.parse(playlistData))
            .then(parsedPlaylistData => parsedPlaylistData.tracks.total)
            .then((totalTracks) => {
              if (DEBUG_MODE) console.log(`301 [${Date.now() - TIME_START}ms] -> PLAYLIST WITH ID ${userPlaylist} HAS ${totalTracks} TOTAL TRACKS!`);
              if (DEBUG_MODE) console.log(`302 [${Date.now() - TIME_START}ms] -> CREATING ARRAY OF TRACK IDS...`);
              const p = [];
              for (let i = 0; i < totalTracks; i += 100) {
                if (DEBUG_MODE) console.log(`305 [${Date.now() - TIME_START}ms] -> LOOKING THROUGH TRACKS ${i} - ${i + 100}`);
                p.push(
                  request({
                    method: 'GET',
                    url: `https://api.spotify.com/v1/users/${userId}/playlists/${userPlaylist}/tracks?offset=${i}&limit=100`,
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                  }));
              }
              if (DEBUG_MODE) console.log(`313 [${Date.now() - TIME_START}ms] -> STARTING PROMISE CALL TO GET ${userPlaylist} TRACK IDS`);
              Promise.all(p)
              .then(data => data.map(d => JSON.parse(d)))
              .then(parsedData => parsedData.map(d => d.items))
              .then(itemsData => itemsData.map(i => i.map(d => d.track.id)))
              .then(tracksIds => _.flatten(tracksIds))
              .then((tracksIds) => {
                if (DEBUG_MODE) console.log(`320 [${Date.now() - TIME_START}ms] -> TRACK IDS RETRIEVED! COMPARING WITH TRACKS PROVIDED...`);
                let tracksToAdd = _.difference(tracks, tracksIds);
                tracksToAdd = tracksToAdd.map(t => `spotify:track:${t}`);
                if (DEBUG_MODE) console.log(`323 [${Date.now() - TIME_START}ms] -> FOUND ${tracksToAdd.length} TRACKS TO ADD!`);
                let tracksToRemove = _.difference(tracksIds, tracks);
                tracksToRemove = tracksToRemove.map(t => `spotify:track:${t}`);
                if (DEBUG_MODE) console.log(`326 [${Date.now() - TIME_START}ms] -> FOUND ${tracksToRemove.length} TRACKS TO REMOVE!`);
                if (DEBUG_MODE) console.log(`327 [${Date.now() - TIME_START}ms] -> PLAYLIST SHOULD HAVE ${tracksIds.length + tracksToAdd.length - tracksToRemove.length} TRACKS!`);
                if (DEBUG_MODE) console.log(`328 [${Date.now() - TIME_START}ms] -> REMOVING TRACKS FROM PLAYLIST...`);
                const removeP = [];
                for (let i = 0; i < tracksToRemove.length; i += 50) {
                  if (DEBUG_MODE) console.log(`331 [${Date.now() - TIME_START}ms] -> CREATING REMOVE PROMISES, TRACKS ${i} - ${i + 50}`);
                  let tracksToRemoveThisIteration = tracksToRemove.slice(i, i + 50);
                  tracksToRemoveThisIteration = tracksToRemoveThisIteration.map((t) => {
                    return { uri: t };
                  });
                  console.log(tracksToRemoveThisIteration);
                  removeP.push(
                    request({
                      method: 'DELETE',
                      url: `https://api.spotify.com/v1/users/${userId}/playlists/${userPlaylist}/tracks`,
                      headers: { Authorization: `Bearer ${user.accessToken}` },
                      body: JSON.stringify({ tracks: tracksToRemoveThisIteration }),
                    }));
                }
                if (DEBUG_MODE) console.log(`344 [${Date.now() - TIME_START}ms] -> ABOUT TO START PROMISE ALL, REMOVING TRACKS...`);
                Promise.all(removeP)
                .then((removeResponse) => {
                  if (DEBUG_MODE) console.log(`347 [${Date.now() - TIME_START}ms] -> PROMISE ALL HAS ENDED! RESPONSE IS: ${removeResponse}`);
                  if (DEBUG_MODE) console.log(`348 [${Date.now() - TIME_START}ms] -> ADDING TRACKS FROM PLAYLIST...`);
                  const addP = [];
                  for (let i = 0; i < tracksToAdd.length; i += 50) {
                    if (DEBUG_MODE) console.log(`351 [${Date.now() - TIME_START}ms] -> CREATING ADD PROMISES, TRACKS ${i} - ${i + 50}`);
                    addP.push(
                      request({
                        method: 'POST',
                        url: `https://api.spotify.com/v1/users/${userId}/playlists/${userPlaylist}/tracks`,
                        headers: { Authorization: `Bearer ${user.accessToken}` },
                        body: JSON.stringify({ uris: tracksToAdd.slice(i, i + 50) }),
                      }));
                  }
                  if (DEBUG_MODE) console.log(`360 [${Date.now() - TIME_START}ms] -> ABOUT TO START PROMISE ALL, ADDING TRACKS...`);
                  Promise.all(addP)
                  .then((addResponse) => {
                    if (DEBUG_MODE) console.log(`363 [${Date.now() - TIME_START}ms] -> PROMISE ALL HAS ENDED! RESPONSE IS: ${addResponse}`);
                  })
                  .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          } else {
            if (DEBUG_MODE) console.log(`374 [${Date.now() - TIME_START}ms] -> PLAYLIST NOT FOUND IN SPOTIFY! CREATING ONE...`);
            request({
              method: 'POST',
              url: `https://api.spotify.com/v1/users/${userId}/playlists`,
              headers: { Authorization: `Bearer ${user.accessToken}` },
              body: JSON.stringify({
                name: 'World FM',
                description: 'Created with love, just for you!',
              }),
            })
            .then(newPlaylistData => JSON.parse(newPlaylistData))
            .then(parsedNewPlaylistData => parsedNewPlaylistData.id)
            .then((newPlaylistId) => {
              if (DEBUG_MODE) console.log(`368 [${Date.now() - TIME_START}ms] -> PLAYLIST CREATED WITH ID ${newPlaylistId}`);
              knex('user')
              .where('id', userId)
              .update({ playlist: newPlaylistId })
              .catch(err => console.log(err));
              if (DEBUG_MODE) console.log(`392 [${Date.now() - TIME_START}ms] -> SAVED PLAYLIST ${newPlaylistId} IN DATABASE!`);
              if (DEBUG_MODE) console.log(`393 [${Date.now() - TIME_START}ms] -> SYNCING PLAYLIST...`);
              const tracksToAdd = tracks.map(t => `spotify:track:${t}`);
              if (DEBUG_MODE) console.log(`395 [${Date.now() - TIME_START}ms] -> ADDING ${tracksToAdd.length} TRACKS TO PLAYLIST...`);
              const addP = [];
              for (let i = 0; i < tracksToAdd.length; i += 50) {
                if (DEBUG_MODE) console.log(`398 [${Date.now() - TIME_START}ms] -> CREATING ADD PROMISES, TRACKS ${i} - ${i + 50}`);
                addP.push(
                  request({
                    method: 'POST',
                    url: `https://api.spotify.com/v1/users/${userId}/playlists/${newPlaylistId}/tracks`,
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                    body: JSON.stringify({ uris: tracksToAdd.slice(i, i + 50) }),
                  }));
              }
              if (DEBUG_MODE) console.log(`407 [${Date.now() - TIME_START}ms] -> ABOUT TO START PROMISE ALL, ADDING TRACKS...`);
              Promise.all(addP)
              .then((addResponse) => {
                if (DEBUG_MODE) console.log(`410 [${Date.now() - TIME_START}ms] -> PROMISE ALL HAS ENDED! RESPONSE IS: ${addResponse}`);
              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};

Playlist.nuke = user =>
  new Promise((resolve, reject) => {
    const userId = user.id;
    User.getUser(user)
      .then((userData) => {
        if (userData.playlist === null) {
          resolve(true);
        } else {
          user.playlist = userData.playlist;
          request({
            method: 'GET',
            url: `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`,
            headers: { Authorization: `Bearer ${user.accessToken}` },
          })
          .then(userPlaylistsData => JSON.parse(userPlaylistsData))
          .then(parsedUserPlaylistsData => parsedUserPlaylistsData.items.map(i => i.id))
          .then(mappedUserPlaylistsData => _.contains(mappedUserPlaylistsData, user.playlist))
          .then((playlistIsInSpotify) => {
            if (playlistIsInSpotify) {
              request({
                method: 'GET',
                url: `https://api.spotify.com/v1/users/${userId}/playlists/${user.playlist}?fields=tracks(total)`,
                headers: { Authorization: `Bearer ${user.accessToken}` },
              })
              .then(playlistData => JSON.parse(playlistData))
              .then(parsedPlaylistData => parsedPlaylistData.tracks.total)
              .then((totalTracks) => {
                const p = [];
                for (let i = 0; i < totalTracks; i += 100) {
                  p.push(
                    request({
                      method: 'GET',
                      url: `https://api.spotify.com/v1/users/${userId}/playlists/${user.playlist}/tracks?offset=${i}&limit=100`,
                      headers: { Authorization: `Bearer ${user.accessToken}` },
                    }));
                }
                Promise.all(p)
                .then(data => data.map(d => JSON.parse(d)))
                .then(parsedData => parsedData.map(d => d.items))
                .then(itemsData => itemsData.map(i => i.map(d => d.track.id)))
                .then(tracksIds => _.flatten(tracksIds))
                .then(tracksIds => tracksIds.map(t => `spotify:track:${t}`))
                .then((tracksIds) => {
                  const removeP = [];
                  for (let i = 0; i < tracksIds.length; i += 25) {
                    let tracksToRemove = tracksIds.slice(i, i + 25);
                    tracksToRemove = tracksToRemove.map(t => ({ uri: t }));
                    removeP.push(
                      request({
                        method: 'DELETE',
                        url: `https://api.spotify.com/v1/users/${userId}/playlists/${user.playlist}/tracks`,
                        headers: { Authorization: `Bearer ${user.accessToken}` },
                        body: JSON.stringify({ tracks: tracksToRemove }),
                      }));
                  }
                  Promise.all(removeP)
                  .then(() => {
                    resolve(true);
                  })
                  .catch(err => reject(err));
                })
                .catch(err => reject(err));
              })
              .catch(err => reject(err));
            } else {
              resolve(true);
            }
          })
          .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });

Playlist.save = (req, res) => {
  // AKA PROMISE HELL!
  const DEBUG_MODE = true;
  const TIME_START = Date.now();
  // Case Auth
  if (req.user) {
    const userId = req.user.id;
    if (DEBUG_MODE) console.log(`435 [${Date.now() - TIME_START}ms] -> AUTHENTICATED!`);
    if (DEBUG_MODE) console.log(`436 [${Date.now() - TIME_START}ms] -> USER ID: ${userId}`);
    const tracks = req.body.tracks.map(t => t.track_id);
    if (DEBUG_MODE) console.log(`438 [${Date.now() - TIME_START}ms] -> RECEIVED ${tracks.length} TRACKS!`);
    if (DEBUG_MODE) console.log(`439 [${Date.now() - TIME_START}ms] -> PLAYLIST DOESN'T EXISTS, CREATING ONE...`);
    request({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
      body: JSON.stringify({
        name: `World FM | ${req.body.country} | ${Date.now()}`,
        description: 'Be cool, but also be warm!',
      }),
    })
    .then(newPlaylistData => JSON.parse(newPlaylistData))
    .then(parsedNewPlaylistData => parsedNewPlaylistData.id)
    .then((newPlaylistId) => {
      if (DEBUG_MODE) console.log(`452 [${Date.now() - TIME_START}ms] -> PLAYLIST CREATED WITH ID ${newPlaylistId}`);
      if (DEBUG_MODE) console.log(`453 [${Date.now() - TIME_START}ms] -> SYNCING PLAYLIST...`);
      const tracksToAdd = tracks.map(t => `spotify:track:${t}`);
      if (DEBUG_MODE) console.log(`455 [${Date.now() - TIME_START}ms] -> ADDING ${tracksToAdd.length} TRACKS TO PLAYLIST...`);
      const addP = [];
      for (let i = 0; i < tracksToAdd.length; i += 50) {
        if (DEBUG_MODE) console.log(`459 [${Date.now() - TIME_START}ms] -> CREATING ADD PROMISES, TRACKS ${i} - ${i + 50}`);
        addP.push(
          request({
            method: 'POST',
            url: `https://api.spotify.com/v1/users/${userId}/playlists/${newPlaylistId}/tracks`,
            headers: { Authorization: `Bearer ${req.user.accessToken}` },
            body: JSON.stringify({ uris: tracksToAdd.slice(i, i + 50) }),
          }));
      }
      if (DEBUG_MODE) console.log(`467 [${Date.now() - TIME_START}ms] -> ABOUT TO START PROMISE ALL, ADDING TRACKS...`);
      Promise.all(addP)
      .then((addResponse) => {
        if (DEBUG_MODE) console.log(`470 [${Date.now() - TIME_START}ms] -> PROMISE ALL HAS ENDED! RESPONSE IS: ${addResponse}`);
        res.status(471).send(addResponse);
      })
      .catch(err => res.status(473).send(err));
    })
    .catch(err => res.status(475).send(err));
  } else {
    // Case No Auth
    res.status(478).send();
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Database
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Playlist.postPlaylist = (playlist) => {
  knex('playliststest').where('playlist_id', playlist.playlist_id)
    .then((data) => {
      if (data.length > 0) {
        console.log('Playlist already exists!');
      } else {
        knex('playliststest').insert(playlist)
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
