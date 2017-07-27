// Database is currently deployed, ask scrum master for credentials
// If you want to make experimental changes or drop the database
// please use a local version
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.db_host,
      user: process.env.db_username,
      password: process.env.db_password,
      database: process.env.db_name,
    },
  },
};
