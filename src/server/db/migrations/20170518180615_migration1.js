exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('playlists', function (table) {
      table.string('name');
      table.string('playlistId');
      table.integer('tracks');
    }).then(function () {
      console.log('created playlists table!')
    }),
    knex.schema.createTableIfNotExists('songs', function (table) {
      table.string('songName');
      table.string('artistName');
      table.string('previewUrl');
      table.string('albumArt');
      table.string('songId');
      table.string('playlistId');
    }).then(function (){
      console.log('created songs tables!')
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlists'),
    knex.schema.dropTable('songs')
  ]);
};
