USE worldfmdb;

DROP TABLE IF EXISTS user;
CREATE TABLE user
(
  id  varchar(255) NOT NULL,
  displayName   varchar(255),
  profile_url    varchar(255),
  image  varchar(255),
  playlist varchar(255),
  sync   boolean,

  PRIMARY KEY (id)
)
