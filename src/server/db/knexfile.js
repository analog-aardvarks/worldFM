const config = require('../../../config.js');

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.db_host || config.db_host,
      user: process.env.db_username || config.db_username,
      password: process.env.db_password || config.db_password,
      database: process.env.db_name || config.db_name,
    },
  },
};
