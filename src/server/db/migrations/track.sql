USE worldfmdb;

DROP TABLE IF EXISTS track;
CREATE TABLE track
(
  id          varchar(255) NOT NULL,
  name        varchar(500)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  artist_id   varchar(255),
  artist_name varchar(500)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  preview_url varchar(255),
  album_id    varchar(255),
  album_name  varchar(255)
    CHARACTER SET utf8
    COLLATE utf8_general_ci,
  album_type  varchar(255),
  album_image varchar(255),
  popularity  int,
  length      int,
  position    int,

  PRIMARY KEY (id)
)
