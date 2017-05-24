import React from 'react';
import PropTypes from 'prop-types';
import SongHover from './SongHover'

const TOTAL_MARGINS = 2; // px

const Song = ({ size, track, onClick, ranking, currentSong }) => {
  const netSize = size - TOTAL_MARGINS;
  // console.log(track);
  return (
    <div>
      <div
        onClick={() => onClick(track.track_preview_url)}
        className="Song"
        style={{
          backgroundImage: `url(${track.track_album_image})`,
          minWidth: netSize,
          maxWidth: netSize,
          minHeight: netSize,
          maxHeight: netSize
        }}
      >
        <SongHover
          currentSong={currentSong}
          track={track}
        />
        <div className="Song__container">
          <span className="Song__ranking">{ranking < 10 ? `0${ranking}` : ranking}</span>
          <div className="Song__info">
            <span className="Song__name">{track.track_name}</span>
            <span className="Song__artist">{JSON.parse(track.track_artist_name).join(', ')}</span>
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
