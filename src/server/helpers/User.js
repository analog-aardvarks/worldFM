const _ = require('underscore');
const knex = require('../db/db');
const Playlist = require('./Playlist');

const User = {};

User.getUser = user =>
  new Promise((resolve, reject) =>
    knex('users').where('user_id', user.id)
      .then((userData) => {
        if (userData.length > 0) resolve(userData[0]);
        else resolve(false);
      })
      .catch(err => console.log(err)));

User.login = (user) => {
  knex('users').where('user_id', user.id)
    .then((data) => {
      if (data.length > 0) {
        console.log(`user ${data.user_id} already exists!`);
      } else {
        const newUser = {
          user_id: user.id,
          user_name: user.username,
          user_url: user.profileUrl,
          // user_image: user.photos[0],
          user_favorites: '',
          user_sync: false,
        };
        knex('users').insert(newUser)
          .then(() => console.log(`User ${user.id} successfully added!`));
      }
    })
    .catch(err => console.log(err));
};

User.getFavoriteTracks = userId =>
  new Promise((resolve, reject) => {
    knex('users').where('user_id', userId)
    .then((userData) => {
      let favs = userData[0].user_favorites;
      if (!favs) {
        resolve([]);
      } else {
        knex('tracks')
        .groupBy('track_id')
        .whereIn('track_id', favs.split(','))
        .then((favTracks) => {
          const orderedFavs = [];
          favs = favs.split(',');
          favs.forEach((f) => {
            favTracks.forEach((t) => {
              if (t.track_id === f) orderedFavs.push(t);
            });
          });
          console.log(favTracks.map(t => t.track_name));
          return orderedFavs;
        })
        .then(favTracks => resolve(favTracks))
        .catch(err => reject(err));
      }
    })
    .catch(err => reject(err));
  });

User.addFavorite = (req, res) => {
  User.getUser(req.user)
    .then((user) => {
      const favs = user.user_favorites;
      let newFavs;
      if (favs) {
        if (!favs.includes(req.body.track_id)) {
          newFavs = `${favs},${req.body.track_id}`;
        } else {
          newFavs = favs;
        }
      } else {
        newFavs = req.body.track_id;
      }
      knex('users').where('user_id', req.user.id).update({
        user_favorites: newFavs,
      })
        .then((data) => {
          User.getFavoriteTracks(req.user.id)
            .then((updatedFavs) => {
              if (updatedFavs) {
                res.send((updatedFavs));
              } else {
                res.send([]);
              }
              if (user.user_sync) Playlist.sync(req.user, updatedFavs);
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
};

User.removeFavorite = (req, res) => {
  User.getUser(req.user)
    .then(((user) => {
      const favs = user.user_favorites.split(',');
      const newFavs = _.reject(favs, f => f === req.body.track_id).join(',');
      knex('users').where('user_id', req.user.id).update({
        user_favorites: newFavs,
      })
        .then(data => User.getFavoriteTracks(req.user.id))
        .then((updatedFavs) => {
          if (updatedFavs) res.send(updatedFavs);
          else res.send([]);
          console.log('USER', user);
          if (user.user_sync) {
            Playlist.nuke(req.user)
              .then(() => Playlist.sync(req.user, updatedFavs))
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    }))
    .catch(err => console.log(err));
  console.log('DELETED!');
};

User.toggleSync = (req, res) => {
  User.getUser(req.user)
    .then((userData) => {
      if (userData.user_sync !== req.body.sync) {
        knex('users').where('user_id', req.user.id).update({
          user_sync: req.body.sync,
        })
        .then(() => res.send(req.body.sync));
        if (req.body.sync === true) {
          User.getFavoriteTracks(req.user.id)
            .then(favs => Playlist.sync(req.user, favs))
            .catch(err => console.log(err));
        }
      } else {
        res.send(req.body.sync);
      }
    });
};

module.exports = User;
