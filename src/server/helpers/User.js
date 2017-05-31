const knex = require('../db/db');

exports.login = (user) => {
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
        };
        knex('users').insert(newUser)
          .then(() => console.log(`User ${user.id} successfully added!`))
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};

exports.getFavorites = (req, res) => {
  knex('users').where('user_id', req.user.id)
    .then((user) => {
      const favs = user[0].user_favorites;
      if (favs) {
        res.send(favs.split(','));
      } else {
        res.send([]);
      }
    })
    .catch(err => console.log(err));
};


exports.addFavorite = (req, res) => {
  console.log(req.user.id);
  knex('users').select('user_favorites').where('user_id', req.user.id)
    .then((user) => {
      const favs = user[0].user_favorites;
      let newFavs;
      if (favs) {
        if (!favs.includes(req.body.track_id)) {
          newFavs = `${favs},${req.body.track_id}`;
        } else {
          console.log('DENIED!');
          newFavs = favs;
        }
      } else {
        newFavs = req.body.track_id;
      }
      knex('users').where('user_id', req.user.id).update({
        user_favorites: newFavs,
      })
        .then((data) => {
          exports.getFavorites(req, res);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.removeFavorite = (req, res) => {

}
