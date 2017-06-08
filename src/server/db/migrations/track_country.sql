USE worldfmdb;

DROP TABLE IF EXISTS track_country;
CREATE TABLE track_country
(
  track   varchar(255),
  country varchar(255),

  PRIMARY KEY (track, country)
)
