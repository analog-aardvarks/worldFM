// const config = require('../../../config.js');

// Database is currently deployed, ask scrum master for credentials
// If you want to make experimental changes or drop the database
// please use a local version
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.databaseHost,
      user: process.env.databaseUsername,
      password: process.env.databasePassword,
      database: process.env.databaseName,
    },
  },
};
