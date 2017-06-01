const knex = require('../db/db');
const _ = require('underscore');

const User = {};

User.getUser = user =>
  new Promise((resolve, reject) =>
    knex('users').where('user_id', user.id)
      .then((userData) => {
        if (userData.length > 0) resolve(userData.split(','));
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
      const favs = userData[0].user_favorites;
      if (!favs) {
        resolve(false);
      } else {
        knex('tracks')
          .groupBy('track_id')
          .whereIn('track_id', favs.split(','))
            .then(favTracks => resolve(favTracks))
            .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  });

User.addFavorite = (req, res) => {
  knex('users').select('user_favorites').where('user_id', req.user.id)
    .then((user) => {
      const favs = user[0].user_favorites;
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
          console.log('something happening');
          User.getFavoriteTracks(req.user.id)
            .then((updatedFavs) => {
              console.log('OUTER ENTERED');
              if (updatedFavs) {
                console.log('ENTERED');
                res.send((updatedFavs));
              } else {
                res.send([]);
              }
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
};

User.removeFavorite = (req, res) => {
  knex('users').select('user_favorites').where('user_id', req.user.id)
    .then(((user) => {
      const favs = user[0].user_favorites.split(',');
      const newFavs = _.reject(favs, f => f === req.body.track_id).join(',');
      knex('users').where('user_id', req.user.id).update({
        user_favorites: newFavs,
      })
        .then(data => User.getFavoriteTracks(req.user.id))
        .then((updatedFavs) => {
          if (updatedFavs) res.send(updatedFavs);
          else res.send([]);
        });
    }))
    .catch(err => console.log(err));
  console.log('DELETED!');
};

module.exports = User;
