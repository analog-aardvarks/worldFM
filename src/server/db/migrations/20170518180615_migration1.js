exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('playlists', function(table) {
      table.string( 'playlist_id');
      table.string('playlist_name');
      table.string( 'playlist_tracks', 3000);
      table.integer('playlist_tracks_total');
    })
    .then(function () {
      console.log('table \'playlists\' successfully created!');
    }),

    knex.schema.createTableIfNotExists('tracks', function(table) {
      table.string('track_id');
      table.string('track_name').collate('utf8_general_ci');;
      table.string('track_preview_url');
      table.string('track_album_id');
      table.string('track_album_image');
      table.string('track_artist_name', 500).collate('utf8_general_ci');
    })
    .then(function (){
      console.log('table \'tracks\' successfully created!');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('playlists'),
    knex.schema.dropTableIfExists('tracks')
  ]);
};
