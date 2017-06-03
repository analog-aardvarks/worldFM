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

  if (windowWidth < 700 || windowHeight < 700) {
    size = Math.min(windowWidth, windowHeight - 120) * 0.9;
  }

  return (
    lightbox.show ? (
      <div
      className="Lightbox"
      onClick={hideLightbox}
      >
      <img
        className="FullAlbumArt"
        src={lightbox.src}
        alt="Album Art"
        width={size}
        height={size}
      />
      </div>
    ) : null
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
