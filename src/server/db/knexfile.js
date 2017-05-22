var config = require('../../../config.js');

// Database is currently deployed, ask scrum master for credentials
// If you want to make experimental changes or drop the database
// please use a local version
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
