exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTableIfNotExists('playlists', (table) => {
      table.string('playlist_id');
      table.string('playlist_name');
      table.string('playlist_tracks', 5500);
      table.integer('playlist_tracks_total');
    })
    .then(() => {
      console.log('table \'playlists\' successfully created!');
    }),

    knex.schema.createTableIfNotExists('tracks', (table) => {
      table.string('track_id');
      table.string('track_artist_id');
      table.string('track_artist_name', 500).collate('utf8_general_ci');
      table.string('track_name', 500).collate('utf8_general_ci');
      table.string('track_preview_url');
      table.string('track_album_id');
      table.string('track_album_name').collate('utf8_general_ci');
      table.string('track_album_type');
      table.string('track_album_image');
      table.integer('track_popularity');
      table.integer('track_length');
      table.integer('track_position');
    })
    .then(() => {
      console.log('table \'tracks\' successfully created!');
    }),

    knex.schema.createTableIfNotExists('users', (table) => {
      table.string('user_id');
      table.string('user_name');
      table.string('user_url');
      table.string('user_image');
      table.string('user_favorites', 10000);
      table.string('user_playlist');
      table.boolean('user_sync');
    })
    .then(() => {
      console.log('table \'users\' successfully created!');
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTableIfExists('playlists'),
    knex.schema.dropTableIfExists('tracks'),
    // knex.schema.dropTable('users'),
  ]);
