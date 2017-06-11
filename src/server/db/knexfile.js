// const config = require('../../../config.js');

// Database is currently deployed, ask scrum master for credentials
// If you want to make experimental changes or drop the database
// please use a local version
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.db_host || 'worldfmdbinstance.c3vuf1p7s48h.us-east-2.rds.amazonaws.com',
      user: process.env.db_username || 'worldfm',
      password: process.env.db_password || 'aabbccdd',
      database: process.env.db_name || 'worldfmdb',
    },
  },
};
