USE worldfmdb;

DROP TABLE IF EXISTS playlist;
CREATE TABLE playlist
(
  id  varchar(255) NOT NULL,
  name varchar(255) NOT NULL,

  PRIMARY KEY (id)
)
