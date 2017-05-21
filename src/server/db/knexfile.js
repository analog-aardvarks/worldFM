var config = require('../../../config.js');

// database now deployed!
// if you want to experiment and add experimental features
// please use a local version of the database
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : config.db_host,
      user : config.db_username,
      password : config.db_password,
      database : config.db_name,
    },
  },
};
