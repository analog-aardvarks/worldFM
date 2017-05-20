let config = require("../knexfile.js");
let knex = require('knex')(config.development);

module.exports = knex;
