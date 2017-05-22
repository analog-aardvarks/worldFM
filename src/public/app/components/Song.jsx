import React from 'react';
import PropTypes from 'prop-types';
import SongHover from './SongHover.jsx'

const TOTAL_MARGINS = 2; // px

const Song = ({ size, track, onClick, ranking }) => {
  const netSize = size - TOTAL_MARGINS;
  console.log(track);
  return (
    <div>
      <div
        onClick={() => onClick(track.preview_url)}
        className="Song"
        style={{
          backgroundImage: `url(${track.album.images[0].url})`,
          minWidth: netSize,
          maxWidth: netSize,
          minHeight: netSize,
          maxHeight: netSize
        }}
      >
        <SongHover />
        <div className="Song__container">
          <span className="Song__ranking">{ranking < 10 ? `0${ranking}` : ranking}</span>
          <div className="Song__info">
            <span className="Song__name">{track.name}</span>
            <span className="Song__artist">{track.artists[0].name}</span>
          </div>
          <span className="Song__expand">
            <i className="fa fa-chevron-circle-up fa-2x fa-fw" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Song;
