import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ lightbox, windowWidth, windowHeight }) => ({
  lightbox,
  windowWidth,
  windowHeight,
});

const mapDispatchToProps = dispatch => ({
  hideLightbox: () => dispatch({ type: 'HIDE_LIGHTBOX' }),
  changeImage: (track, list) => {
    dispatch({ type: 'SHOW_LIGHTBOX', track, list });
    console.log('TRACK: ', track);
    console.log('LIST: ', list);
  },
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

  render() {
    return (
      this.props.lightbox.show ? (
        <div>
          <div
            className="Lightbox"
            onClick={this.props.hideLightbox}
          >
            <div className="Lightbox__content">
              <button onClick={(e) => {
                e.stopPropagation();
                this.prevImage();
              }}
              >
                Previous
              </button>
              {console.log('TRACK AT RENDER: ', this.track)}
              <img
                className="Lightbox__contentFullAlbumArt"
                src={this.track.track_album_image}
                alt="Album Art"
                width={this.size}
                height={this.size}
              />
              <button onClick={(e) => {
                e.stopPropagation();
                this.nextImage();
              }}
              >
                Next
              </button>
              <div className="Lightbox__contentAlbumInfo">
                <span>{this.track.track_name}</span>
                <span style={{ fontFamily: "'Permanent Marker', cursive" }}>{this.artists}</span>
                {this.countries && <span>Trending in: {this.countries}</span>}
              </div>
            </div>
          </div>
        </div>
      ) : null
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
