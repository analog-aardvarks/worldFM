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
        <div className="Song__info">
          <span
            className="Song__name"
            style={{
              fontFamily: '\'Archivo Black\', sans-serif',
              fontSize: '15px',
              color: 'white',
              backgroundColor: 'rgba(15, 15, 15, 0.35)',
              display: 'block',
            }}>
            {props.name}
          </span>
          <span
            className="Song__artist"
            style={{
              fontFamily: '\'Archivo Black\', sans-serif',
              fontSize: '15px',
              color: 'white',
              display: 'block',
              backgroundColor: 'rgba(15, 15, 15, 0.35)',
            }}>
            {props.artists[0].name}
          </span>
        </div>
        <span
          className="Song__artist"
          style={{
            fontFamily: '\'Archivo Black\', sans-serif',
            fontWeight: '900',
            fontSize: '30px',
            color: 'white',
            alignSelf: 'flex-end',
          }}>
          {props.ranking}
        </span>
      </div>
    );
}

export default Song;
