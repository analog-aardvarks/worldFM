const config = require("./knexfile.js");
const env = 'deployed';

module.exports = require('knex')(config[env]);
