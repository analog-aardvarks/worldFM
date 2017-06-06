USE worldfmdb;

DROP TABLE IF EXISTS usertest;
CREATE TABLE usertest
(
  id  varchar(255) NOT NULL,
  username   varchar(255) NOT NULL,
  profile_url    varchar(255),
  image  varchar(255),
  playlist varchar(255),
  sync   boolean,

  PRIMARY KEY (id)
)
