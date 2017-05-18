let config = require("./knexfile.js");
let env = 'development';

module.exports = require('knex')(config[env]);
