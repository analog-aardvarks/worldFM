exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('playlists', function(table) {
      table.string( 'playlist_name');
      table.string( 'playlist_id');
      table.integer('playlist_tracks_total');
    })
    .then(function () {
      console.log('table \'playlist\' successfully created!');
    }),

    knex.schema.createTableIfNotExists('songs', function(table) {
      table.string('track_name');
      table.string('track_id');
      table.string('track_preview_url');
      table.string('track_album_id');
      table.string('track_album_image');
      table.string('track_artist_name');
      table.string('track_playlist_id');
    })
    .then(function (){
      console.log('table \'songs\' successfully created!');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlists'),
    knex.schema.dropTable('songs')
  ]);
};
