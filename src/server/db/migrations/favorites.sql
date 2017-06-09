USE worldfmdb;

DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites
(
  user varchar(255) NOT NULL,
  track varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user, track)
)
