USE worldfmdb;

DROP TABLE IF EXISTS playlist_country;
CREATE TABLE playlist_country
(
  playlist  varchar(255),
  country   varchar(255),

  PRIMARY KEY (playlist, country)
)
