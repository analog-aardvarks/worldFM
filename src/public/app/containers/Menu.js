import React from 'react';
import { connect } from 'react-redux';
import { setPlaylist, setCurrentCountry, setCurrentTrend, closeSongMenu, removeTrackFromSpotifyQueue } from '../actions';
import availableCountries from '../constants/availableCountries';
import TopMenu from '../components/TopMenu';
import CountryMenu from '../components/CountryMenu';
import FavoritesMenu from '../components/FavoritesMenu';
import SideMenu from '../components/SideMenu';
import QueueMenu from '../components/QueueMenu';
import About from '../components/About';
import SweetScroll from 'sweet-scroll';

const mapStateToProps = state => ({
  windowHeight: state.windowHeight,
  windowWidth: state.windowWidth,
  auth: state.auth,
  currentCountry: state.currentCountry,
  currentGenre: state.currentGenre,
  currentTrend: state.currentTrend,
  showTrackInfo: state.showTrackInfo,
  showSpotifyPlaylist: state.showSpotifyPlaylist,
  showCountryMenu: state.showCountryMenu,
  showSideMenu: state.showSideMenu,
  showQueueMenu: state.showQueueMenu,
  favorites: state.favorites,
  showAbout: state.showAbout,
  showFavoritesMenu : state.showFavoritesMenu ,
  showQueueMenu: state.showQueueMenu,
  spotifyPlayer: state.spotifyPlayer,
  showTopMenu: state.showTopMenu,
});

const mapDispatchToProps = dispatch => ({
  setCurrentCountry: country => dispatch(setCurrentCountry(country)),
  setCurrentTrend: trend => dispatch(setCurrentTrend(trend)),
  setPlaylist: playlist => dispatch(setPlaylist(playlist)),
  showTrackInfoEvent: () => dispatch({ type: 'SHOW_TRACK_INFO' }),
  hideTrackInfoEvent: () => dispatch({ type: 'HIDE_TRACK_INFO' }),
  showSpotifyPlaylistEvent: () => dispatch({ type: 'SHOW_SPOTIFY_PLAYLIST' }),
  hideSpotifyPlaylistEvent: () => dispatch({ type: 'HIDE_SPOTIFY_PLAYLIST' }),
  showCountryMenuEvent: () => dispatch({ type: 'SHOW_COUNTRY_MENU' }),
  hideCountryMenuEvent: () => dispatch({ type: 'HIDE_COUNTRY_MENU' }),
  showQueueMenuEvent: () => dispatch({ type: 'SHOW_QUEUE_MENU' }),
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
  showSideMenuEvent: () => dispatch({ type: 'SHOW_SIDE_MENU' }),
  hideSideMenuEvent: () => dispatch({ type: 'HIDE_SIDE_MENU' }),
  showAboutEvent: () => dispatch({ type: 'SHOW_ABOUT' }),
  hideAboutEvent: () => dispatch({ type: 'HIDE_ABOUT' }),
  showFavoritesMenuEvent: () => dispatch({ type: 'SHOW_FAVORITES_MENU' }),
  hideFavoritesMenuEvent: () => dispatch({ type: 'HIDE_FAVORITES_MENU' }),
  removeTrackFromSpotifyQueue: track => dispatch(removeTrackFromSpotifyQueue(track)),
  showTopMenuEvent: () => dispatch({ type: 'SHOW_TOP_MENU' }),
  hideTopMenuEvent: () => dispatch({ type: 'HIDE_TOP_MENU' }),
});

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTrendChange = this.handleTrendChange.bind(this);
    this.toggleTrackInfo = this.toggleTrackInfo.bind(this);
    this.toggleSpotifyPlaylist = this.toggleSpotifyPlaylist.bind(this);
    this.toggleCountryMenu = this.toggleCountryMenu.bind(this);
    this.toggleFavoritesMenu = this.toggleFavoritesMenu.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.toggleQueueMenu = this.toggleQueueMenu.bind(this);
    this.toggleAbout = this.toggleAbout.bind(this);
    this.removeTrackFromQueue = this.removeTrackFromQueue.bind(this);
    this.toggleTopMenu = this.toggleTopMenu.bind(this);
  }

  componentDidMount() {
    this.getPlaylist();
  }

  componentDidUpdate(prev) {
    if(this.props.currentCountry ===  this.props.currentGenre &&
    this.props.currentCountry === null &&
    this.props.currentGenre === null) {
    } else {
      if (prev.currentCountry !== this.props.currentCountry) {
        this.getPlaylist();
      } else if (prev.currentGenre !== this.props.currentGenre) {
        this.getPlaylist();
      }
    }
  }

  handleCountryChange(e) {
    this.props.setCurrentCountry(e.value);
  }

  handleTrendChange(e) {
    this.props.setCurrentTrend(e.target.value);
  }

  getPlaylist() {
    console.log(this.props.currentGenre, this.props.currentCountry)
    const url = this.props.currentGenre === null ?
      `playlist?country=${this.props.currentCountry}` :
      `playlist?genre=${this.props.currentGenre}`;
    fetch(url)
    .then(res => res.json())
    .then((res) => this.props.setPlaylist(res))
    .catch(err => console.log(err));
  }

  toggleTrackInfo() {
    if (this.props.showTrackInfo) this.props.hideTrackInfoEvent();
    if (!this.props.showTrackInfo) this.props.showTrackInfoEvent();
  }

  toggleSpotifyPlaylist() {
    if (this.props.showSpotifyPlaylist) this.props.hideSpotifyPlaylistEvent();
    if (!this.props.showSpotifyPlaylist) this.props.showSpotifyPlaylistEvent();
  }

  toggleCountryMenu() {
    if (this.props.showCountryMenu) this.props.hideCountryMenuEvent();
    if (!this.props.showCountryMenu) this.props.showCountryMenuEvent();
  }

  toggleFavoritesMenu() {
    if (this.props.showFavoritesMenu) this.props.hideFavoritesMenuEvent();
    if (!this.props.showFavoritesMenu) this.props.showFavoritesMenuEvent();
  }

  toggleSideMenu() {
    if (this.props.showSideMenu) this.props.hideSideMenuEvent();
    if (!this.props.showSideMenu) this.props.showSideMenuEvent();
  }

  toggleQueueMenu() {
    if (this.props.showQueueMenu) this.props.hideQueueMenuEvent();
    if (!this.props.showQueueMenu) this.props.showQueueMenuEvent();
  }

  toggleAbout() {
    if (this.props.showAbout) this.props.hideAboutEvent();
    if (!this.props.showAbout) this.props.showAboutEvent();
  }


  removeTrackFromQueue(track) {
    this.props.removeTrackFromSpotifyQueue(track);
  }

  toggleTopMenu() {
    if (this.props.showTopMenu) {
      this.props.hideTopMenuEvent()
    }
    else {
      this.props.showTopMenuEvent();
    }
  }

  render() {
    return (
      <div>
        <TopMenu
          toggleTopMenu={this.toggleTopMenu}
          toggleFavoritesMenu={this.toggleFavoritesMenu}
          toggleSideMenu={this.toggleSideMenu}
        />

        <FavoritesMenu
          showFavoritesMenu={this.props.showFavoritesMenu}
          favorites={this.props.favorites}
          showQueueMenu={this.props.showQueueMenu}
          windowHeight={this.props.windowHeight}
        />
        <QueueMenu
          toggleQueueMenu={this.toggleQueueMenu}
          favorites={this.props.favorites}
          spotifyPlayer={this.props.spotifyPlayer}
          removeTrackFromQueue={this.removeTrackFromQueue}
        />
        {this.props.showSideMenu ? <SideMenu
          // toggleAbout={this.toggleAbout}
          // toggleCountryMenu={this.toggleCountryMenu}
          // toggleSpotifyPlaylist={this.toggleSpotifyPlaylist}
          // toggleQueueMenu={this.toggleQueueMenu}
          showQueueMenu={this.props.showQueueMenu}
          toggleFavoritesMenu={this.toggleFavoritesMenu}
          windowHeight={this.props.windowHeight}
        /> : null}
      </div>
    );
  }
}

Menu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
export default Menu;
