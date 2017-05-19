exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id').primary();
    table.string('username');
  }).then(function () {
    console.log('created users table!')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
