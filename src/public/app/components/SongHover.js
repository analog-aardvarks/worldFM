import React from 'react';

const SongHover = ({ currentSong, track }) => {
  const icon = currentSong.isPlaying && track.track_preview_url === currentSong.src ? 'fa-pause-circle-o' : 'fa-play-circle-o';
  return (
    <div className="SongHover">
      <i className={`SongHover__play-button fa ${icon} fa-5x fa-fw`}></i>
    </div>
  )
}

export default SongHover;
