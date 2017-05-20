import React from 'react';
import PropTypes from 'prop-types';
import SongHover from './SongHover.jsx'

const TOTAL_MARGINS = 2; // px

const Song = props => {
    const size = props.size - TOTAL_MARGINS;
    return (
      <div>
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
          <SongHover />
          <div className="Song__container">
            <span className="Song__ranking">{props.ranking}</span>
            <div className="Song__info">
              <span className="Song__name">{props.name}</span>
              <span className="Song__artist">{props.artists[0].name}</span>
            </div>
            <span className="Song__expand">
              <i className="fa fa-chevron-circle-up fa-2x fa-fw"></i>
            </span>
          </div>
        </div>
      </div>
    );
}

export default Song;
