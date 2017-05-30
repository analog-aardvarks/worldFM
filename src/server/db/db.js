// TODO refactor so that we can delete this file
const config = require('./knexfile.js');

const env = 'development';

module.exports = require('knex')(config[env]);
