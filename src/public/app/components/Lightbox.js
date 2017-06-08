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
            src={lightbox.src}
            alt="Album Art"
            width={size}
            height={size}
          />
          <div className="Lightbox__contentAlbumInfo">
            <span>{lightbox.name}</span>
            <span style={{ fontFamily: "'Permanent Marker', cursive" }}>{lightbox.artist.join(', ')}</span>
            <span>Trending in </span>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
