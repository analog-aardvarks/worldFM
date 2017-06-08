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

              <div className="Lightbox__contentArtButtons">

                <i
                  className="fa fa fa-chevron-left fa-2x fa-fw"
                  style={{ opacity: "0.4" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.prevImage();
                  }}
                />

                {console.log('TRACK AT RENDER: ', this.track)}

                <div className="Lightbox__contentFullAlbumArtButtons">
                  <img
                    className="Lightbox__contentFullAlbumArt"
                    src={this.track.track_album_image}
                    alt="Album Art"
                    width={this.size}
                    height={this.size}
                  />
                  <div className="Lightbox__contentHover" style={{ width:this.size, height:this.size }}>
                    <i className="fa fa-play fa-2x fa-fw" />
                    <div className="Lightbox__contentHoverRight">
                      <i className="fa fa-heart fa-2x fa-fw" />
                      <i className="fa fa-plus fa-2x fa-fw" />
                    </div>
                  </div>
                </div>

                <i
                  className="fa fa fa-chevron-right fa-2x fa-fw"
                  style={{ opacity: "0.4" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.nextImage();
                  }}
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
