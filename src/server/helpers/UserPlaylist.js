// const rpn = require('request-promise-native');
// const knex = require('../db/db');
// const config = require('../../../config');
//
// const token = 'BQBfs_r76H3RVmELpMnGtCK6iW4Imp1N5LCZw_HgckjPvZop7IrURC7G4qdDSnHspOfr6C2PvH0YYjBiuj8ILCg8OGAmdn0PhKipAjbNdWt9SuKsnAJknjIBRsB24NdGE5cIbzhdRbrqSPTL5gyjrIGaaeUpiq5RxU-rQBLQvMSHIq91Pc-xCqbPYqU2yoFfKQ_erj_X-l2vV9ePTgbGAaLxKBjfDN3n1RqgE0MjlzvjMs_6zJ0WeZtCfy13O2RoYGOrTc7OeFDa7mLAbrTr_ueHUr0mjYdZyx8Lan3UGvkO4Rrz8518I4qLYoVc45mT3OWcLQ';
// const UserPlaylist = {};
//
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Helpers
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// const promisifyGetPlaylistSnapshotId = (userId, playlistId) =>
//   new Promise((resolve, reject) => {
//     console.log('promisifyGetPlaylistSnapshotId');
//     rpn({
//       method: 'GET',
//       url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}?fields=description,name,id,owner(id),snapshot_id,tracks(items(track(id)),offset,total)`,
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(response => resolve(JSON.parse(response)))
//       .catch(err => reject(err));
//   });
//
//
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // Endpoints
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// // UserPlaylist.createUserPlaylist = (userId, playlistName, playlistDescription, isPublic) => {
// //   // creates one new playlist and returns the id
// // }
// //
// // UserPlaylist.createUserPlaylistWithTracks = (userId, playlistName, playlistDescription, isPublic, tracks) => {
// //   // creates one new playlist and adds the corresponding tracks
// // }
// //
// // UserPlaylist.getFromDatabase = userId => {
// //   // queries the dp for the users playlist id and returns the id, if its not there, returns false
// // }
// //
// // UserPlaylist.appPlaylist = userId  => {
// //   // queries the dp for the users playlist id and returns the id (UserPlaylist.getFromDatabase)
// //   // if if doesnt exist, it creates it and returns the id (UserPlaylist.createUserPlaylist)
// // }
// //
// // UserPlaylist.addToAppPlaylist = userId => {
// //   // UserPlaylist.appPlaylist
// //   // adds a song to the app playlist
// // }
// //
// // UserPlaylist.addToAppPlaylistAndPlay = userId => {
// //   // UserPlaylist.appPlaylist
// //   // adds a song to the app playlist and starts playing from that position
// // }
// //
// UserPlaylist.removeFromPlaylist = (req, res) => {
//   console.log('UserPlaylist.removeFromPlaylist');
//   const userId = '1280712546';
//   const playlistId = '2Nuw2c396No8TpqD00aJa4';
//   const positions = [1, 2];
//   const p = promisifyGetPlaylistSnapshotId(userId, playlistId);
//
//   p
//   .then((response) => {
//     const snapshotId = response.snapshot_id;
//     rpn({
//       method: 'DELETE',
//       url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}?fields=${fields}`,
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(response => res.status(200).send(response))
//       .catch(err => res.status(400).send(err));
//     res.status(200).send(snapshotId);
//   })
//   .catch(response => res.status(404).send(response));
// };
// //
// // UserPlaylist.removeAllFromAppPlaylist = userId => {
// //   // get playlist snapshot
// //   // remove all songs from playlist
// // }
//
// UserPlaylist.getInfo = (req, res) => {
//   console.log('UserPlaylist.getInfo');
//   const userId = req.query.user;
//   const playlistId = req.query.id;
//   const fields = 'description,name,id,owner(id),snapshot_id,tracks(items(track(id)),offset,total)';
//
//   rpn({
//     method: 'GET',
//     url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}?fields=${fields}`,
//     headers: { Authorization: `Bearer ${token}` },
//   })
//     .then(response => res.status(200).send(response))
//     .catch(err => res.status(400).send(err));
// };
//
// // UserPlaylist.createUserPlaylist = (req, res) => {
// //   const user_id = req.body.user_id;
// //   const playlist_name = req.body.playlist_name;
// //   const playlist_description = req.body.playlist_description;
// //
// //   // check if playlist already exists for that users
// //
// //   // if not
// //
// //
// // }
//
// // save users / playlist id in Database
//
// // endpoint delete all
//   // get snapid and length
//   // delete all tracks
//
// // play one song
//   // get the playlist from Database
//   // add track
//   // play that track
//
// module.exports = UserPlaylist;
