import React from 'react';
import { connect } from 'react-redux';
import {
  addTrackToSpotifyQueue,
  setFavorites,
} from '../actions';

const mapStateToProps = ({ lightbox, windowWidth, windowHeight, favorites, helperFuncs, spotifyPlayer }) => ({
  lightbox,
  windowWidth,
  windowHeight,
  favorites,
  helperFuncs,
  spotifyPlayer,
});

const mapDispatchToProps = dispatch => ({
  hideLightbox: () => dispatch({ type: 'HIDE_LIGHTBOX' }),
  changeImage: (track, list) => {
    dispatch({ type: 'SHOW_LIGHTBOX', track, list });
    console.log('TRACK: ', track);
    console.log('LIST: ', list);
  },
  addTrackToSpotifyQueue: track => dispatch(addTrackToSpotifyQueue(track)),
  handleFavoritesChange: favorites => dispatch(setFavorites(favorites)),
});

class Lightbox extends React.Component {
  constructor(props) {
    super(props);
    this.size = 640;
    if (props.windowWidth < 900 || props.windowHeight < 900) {
      this.size = Math.min(props.windowWidth, props.windowHeight - 120) * 0.8;
    }
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
    this.addToQueue = this.addToQueue.bind(this);
    this.handleFavoritesClick = this.handleFavoritesClick.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.lightbox.track) {
      this.track = nextProps.lightbox.track;
      this.list = nextProps.lightbox.list;
      this.artists = JSON.parse(nextProps.lightbox.track.track_artist_name).join(', ');
      this.countries = nextProps.lightbox.track.track_countries;
    }
  }

  handleKeyDown(e) {
    if (this.props.lightbox.show) {
      console.log(e.code);
      switch (e.code) {
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
        case 'Escape':
          this.props.hideLightbox();
          break;
        default:
          break;
      }
    }
  }

  nextImage() {
    const index = (this.list.indexOf(this.track) + 1) % this.list.length;
    this.props.changeImage(this.list[index], this.list);
  }

  prevImage() {
    let index = (this.list.indexOf(this.track) - 1);
    index = index >= 0 ? index : this.list.length + index;
    this.props.changeImage(this.list[index], this.list);
  }

  addFavorite(track) {
    fetch('/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(res => res.json())
    .then(favs => this.props.handleFavoritesChange(favs))
    .catch(err => console.log(err));
  }

  removeFavorite(track) {
    fetch('/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(track),
    })
    .then(res => res.json())
    .then(favs => this.props.handleFavoritesChange(favs))
    .catch(err => console.log(err));
  }

  handleFavoritesClick(track) {
    if (this.props.favorites.some(fav => fav.track_id === track.track_id)) {
      this.removeFavorite(track);
    } else this.addFavorite(track);
  }

  addToQueue() { this.props.addTrackToSpotifyQueue(this.track); }

  render() {
    return (
      this.props.lightbox.show ? (
        <div>
          <div
            className="Lightbox"
            onClick={this.props.hideLightbox}
          >
            <div className="Lightbox__content">
              <div className="Lightbox__contentArtButtons">
                <i
                  className="fa fa fa-chevron-left fa-2x fa-fw"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.prevImage();
                  }}
                  data-tip="Previous"
                />
                {/* {console.log('TRACK AT RENDER: ', this.track)} */}
                <div className="Lightbox__contentFullAlbumArtButtons">
                  <div
                    className="Lightbox__contentHover"
                    style={{ width:this.size, height:this.size }}
                    onClick={(e) => e.stopPropagation()}
                    >
                    <div className="Lightbox__contentHoverButtons">
                      <i
                        className="fa fa-play fa-2x fa-fw"
                        onClick={() => this.props.helperFuncs.playExternalTrack(this.track)}
                      />
                      <div className="Lightbox__contentHoverRight">
                        <i
                          className="fa fa-heart fa-2x fa-fw"
                          style={{ color: (this.props.favorites.some(track => track.track_id === this.track.track_id) ? "#1ed760" : "rgb(230, 230, 230)"),
                          zIndex: this.props.auth ? 10 : -100,}}
                          data-tip="Add to favorites"
                          onClick={() => this.handleFavoritesClick(this.track)}
                        />
                        <i
                          className="fa fa-plus fa-2x fa-fw"
                          style={{ color: (this.props.spotifyPlayer.queue.some(track => track.track_id === this.track.track_id) ? "#1ed760" : "rgb(230, 230, 230)"),
                          zIndex: this.props.auth ? 10 : -100, }}
                          data-tip="Add to queue"
                          onClick={this.addToQueue}
                        />
                      </div>
                    </div>
                  </div>
                  <img
                    className="Lightbox__contentFullAlbumArt"
                    src={this.track.track_album_image}
                    alt="Album Art"
                    width={this.size}
                    height={this.size}
                  />
                </div>
                <i
                  className="fa fa fa-chevron-right fa-2x fa-fw"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.nextImage();
                  }}
                  data-tip="Next"
                />
              </div>
              <div className="Lightbox__contentAlbumInfo" style={{ width:this.size }}>
                <span>{this.track.track_name}</span>
                <span style={{ fontFamily: "'Permanent Marker', cursive" }}>{this.artists}</span>
                {this.countries && <span>Trending in:  {this.countries}</span>}
              </div>
            </div>
          </div>
        </div>
      ) : null
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
