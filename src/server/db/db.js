const config = require("./knexfile.js");
const env = 'development';

module.exports = require('knex')(config[env]);
