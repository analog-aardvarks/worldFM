USE worldfmdb;

DROP TABLE IF EXISTS playlist_track;
CREATE TABLE playlist_track
(
  playlist  varchar(255),
  track     varchar(255),

  PRIMARY KEY (playlist, track)
)
