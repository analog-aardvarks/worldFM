import React from 'react';
import PropTypes from 'prop-types';

const TOTAL_MARGINS = 2; // px

const Song = props => {
    const size = props.size - TOTAL_MARGINS;
    return (
      <div
        className="Song"
        style={{
          backgroundImage: `url(${props.album.images[0].url})`,
          minWidth: size,
          maxWidth: size,
          minHeight: size,
          maxHeight: size
        }}
      >
        <span className="Song__name">{props.name}</span>
        <span className="Song__artist">{props.artists[0].name}</span>
      </div>
    );
}

export default Song;
