USE worldfmdb;

DROP TABLE IF EXISTS playlist_tracks
(
  playlist  varchar(255)
  track     varchar(255)

  PRIMARY KEY (playlist, track)
)
