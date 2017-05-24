import React from 'react';

const Song = ({ size, track, onClick, ranking, currentSong, showTrackInfo }) => {

  const borderWidth = 3; // px
  const netSize = size - borderWidth;
  const icon = currentSong.isPlaying && track.track_preview_url === currentSong.src ? 'fa-pause-circle-o' : 'fa-play-circle-o';

  return (
    <div
      className="Song"
      onClick={() => onClick(track.track_preview_url)}
      style={{
        backgroundImage: `url(${track.track_album_image})`,
        width: netSize,
        height: netSize,
      }}
    >

      <div
        className="Song--wrapper"
        style={{
          opacity: showTrackInfo ? 1 : 0,
        }}
      >
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

      <div
        className="SongHover"
        style={{ bottom: netSize - (2 * borderWidth) }}
      >
        <i className={`SongHover__play-button fa ${icon} fa-5x fa-fw`}></i>
      </div>
    </div>
  );
}

/*
<div
  className="Song--wrapper"
  style={{ bottom: netSize - (2 * borderWidth) }}
>
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
*/

export default Song;
