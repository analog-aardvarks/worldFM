const _ = require('underscore');
const knex = require('../db/db');
const Playlist = require('./Playlist');
const Devices = require('./Devices');

const User = {};

User.getUser = user =>
  new Promise((resolve, reject) =>
    knex('usertest').where('id', user.id)
      .then((userData) => {
        if (userData.length > 0) resolve(userData[0]);
        else resolve(false);
      })
      .catch(err => reject(err)));

User.login = profile =>
  new Promise((resolve, reject) => {
    User.getUser(profile)
    .then((userData) => {
      if (userData) {
        resolve(profile);
      } else {
        const newUser = {
          id: profile.id,
          username: profile.username,
          profile_url: profile.profileUrl,
          // user_image: user.photos[0],
          sync: false,
        };
        knex('usertest').insert(newUser)
        .then(() => {
          console.log(`User ${profile.id} successfully added!`);
          resolve(profile);
        });
      }
    })
    .catch(err => reject(err));
  });


User.getFavoriteTracks = user =>
  new Promise((resolve, reject) => {
    console.log('user: ', user);
    knex('tracks')
    .join('favorites', 'tracks.track_id', '=', 'favorites.track')
    .where('favorites.user', user.id)
    .then(favs => resolve(favs))
    .catch(err => reject(err));
  });

User.addFavorite = (req, res) => {
  knex('favorites').insert({ user: req.user.id, track: req.body.track_id })
  .then(() => {
    User.getFavoriteTracks(req.user)
    .then(updatedFavs => res.send(updatedFavs))
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

User.removeFavorite = (req, res) => {
  knex('favorites')
  .where('user', req.user.id).andWhere('track', req.body.track_id)
  .del()
  .then(() => User.getFavoriteTracks(req.user))
  .then(updatedFavs => res.send(updatedFavs))
  .catch(err => console.log(err));
};

User.toggleSync = (req, res) => {
  User.getUser(req.user)
    .then((userData) => {
      if (userData.user_sync !== req.body.sync) {
        knex('user').where('id', req.user.id).update({
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

User.info = (req, res) => {
  if (req.user) {
    const info = {};
    knex('users')
    .where('user_id', req.user.id)
    .then(users => users[0])
    .then((user) => {
      info.sync = user.user_sync;
      // knex('tracks')
      // .groupBy('track_id')
      // .whereIn('track_id', user.user_favorites.split(','))
      // .then((userFavorites) => {
      //   const orderedFavorites = [];
      //   user.user_favorites.split(',').forEach((f) => {
      //     userFavorites.forEach((t) => { if (t.track_id === f) orderedFavorites.push(t); });
      //   });
      //   return orderedFavorites;
      // })
      User.getFavoriteTracks(req.user)
      .then((orderedFavorites) => {
        info.favs = orderedFavorites;
        Devices.getDevices(req.user)
        .then((devices) => {
          // info.devices = devices;
          res.status(200).send(info);
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  } else {
    res.status(204).send();
  }
};

User.all = (req, res) => {
  knex('user').select('*').then(data => res.send(data));
};

module.exports = User;
