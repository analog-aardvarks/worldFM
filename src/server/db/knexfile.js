module.exports = {

  development: {client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'worldfm'
    },
  },
  production: {
    client: 'mysql',
    connection: process.env.DATABASE_URL
  }
};
