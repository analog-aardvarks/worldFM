import React from 'react'
import { connect } from 'react-redux';

const mapStateToProps = ({ lightbox, windowWidth, windowHeight }) => ({
  lightbox,
  windowWidth,
  windowHeight,
});

const mapDispatchToProps = dispatch => ({
  hideLightbox: () => dispatch({ type: 'HIDE_LIGHTBOX' }),
});

const Lightbox = ({ lightbox, hideLightbox, windowWidth, windowHeight }) => {
  let artists;
  let countries;
  if (lightbox.track) {
    artists = JSON.parse(lightbox.track.track_artist_name).join(', ');
    countries = lightbox.track.track_countries;
  }

  let size = 640;

  if (windowWidth < 900 || windowHeight < 900) {
    size = Math.min(windowWidth, windowHeight - 120) * 0.8;
  }

  return (
    lightbox.show ? (
      <div
        className="Lightbox"
        onClick={hideLightbox}
      >
        <div className="Lightbox__content">
          <img
            className="Lightbox__contentFullAlbumArt"
            src={lightbox.track.track_album_image}
            alt="Album Art"
            width={size}
            height={size}
          />
          <div className="Lightbox__contentAlbumInfo">
            <span>{lightbox.track.track_name}</span>
            <span style={{ fontFamily: "'Permanent Marker', cursive" }}>{artists}</span>
            {countries && <span>Trending in: {countries}</span>}
          </div>
        </div>
      </div>
    ) : null
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
