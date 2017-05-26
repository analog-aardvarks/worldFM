import React from 'react';

const Player = () => {
  return (
    <div className="Player">
    <div className="PlayerControls">
      <div className="PlayerControlsPlay">
        <i className="fa fa fa-step-backward fa-lg fa-fw" />
        <i className="fa fa-play fa-2x fa-fw" />
        <i className="fa fa-step-forward fa-lg fa-fw" />
      </div>
      <i className="fa fa-random fa-1x fa-lg RandomButton" />
    </div>
      <div className="CurrentSong">
        <img className="CurrentSongPic" src="https://i.scdn.co/image/2b61b1d9bb5d2dadfe782cfcf1f6f0db840a5973" width = "46" height="46" />
        <div className="CurrentSongInfo">
          <span>Song Name</span>
          <span>Artist</span>
        </div>
      </div>
    </div>
  )
}

export default Player;
