USE worldfmdb;

DROP TABLE IF EXISTS trackstest;
CREATE TABLE trackstest
(
  track_id          varchar(255),
  track_artist_id   varchar(255),
  track_artist_name varchar(500)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  track_name        varchar(500)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  track_preview_url varchar(255),
  track_album_id    varchar(255),
  track_album_name  varchar(255)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  track_album_type  varchar(255),
  track_album_image varchar(255),
  track_popularity  int,
  track_length      int,
  track_position    int,

  PRIMARY KEY (track_id)
)
