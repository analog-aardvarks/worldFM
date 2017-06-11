const config = require('../../../config.js');

// Database is currently deployed, ask scrum master for credentials
// If you want to make experimental changes or drop the database
// please use a local version
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.databaseHost || config.db_host,
      user: process.env.databaseUsername || config.db_username,
      password: process.env.databasePassword || config.db_password,
      database: process.env.databaseName || config.db_name,
    },
  },
};
