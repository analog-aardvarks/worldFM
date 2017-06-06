USE worldfmdb;

DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites
(
  user varchar(255) NOT NULL,
  track varchar(255) NOT NULL,

  PRIMARY KEY (user, track)
)
