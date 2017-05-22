import React from 'react';
import { connect } from 'react-redux';
import { setCurrentSong } from '../actions';
import Songs from '../components/Songs.jsx';

const mapStateToProps = state => ({
  playlist: state.playlist,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: previewUrl =>
      dispatch(setCurrentSong(previewUrl))
  };
}

const CurrentPlaylist = connect(
  mapStateToProps,
  mapDispatchToProps
)(Songs);

export default CurrentPlaylist;
