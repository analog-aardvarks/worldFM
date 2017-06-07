import React from 'react';
import { connect } from 'react-redux';
import { setPlaylist,
  setCurrentCountry,
  setCurrentTrend,
  closeSongMenu,
  removeTrackFromSpotifyQueue,
  addTrackToSpotifyQueue,
  showLightbox} from '../actions';
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
  showUserMenu: state.showUserMenu,
  showCountryDropdown: state.showCountryDropdown,
  showQueueMenu: state.showQueueMenu,
  favorites: state.favorites,
  showAbout: state.showAbout,
  showFavoritesMenu : state.showFavoritesMenu ,
  showQueueMenu: state.showQueueMenu,
  spotifyPlayer: state.spotifyPlayer,
  showTopMenu: state.showTopMenu,
  showAvailableDevices: state.showAvailableDevices,
  showPlayerMobileOptions: state.showPlayerMobileOptions,
  sync: state.sync,
  helperFuncs: state.helperFuncs,
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
  showUserMenuEvent: () => dispatch({ type: 'SHOW_USER_MENU' }),
  hideUserMenuEvent: () => dispatch({ type: 'HIDE_USER_MENU' }),
  showCountryDropdownEvent: () => dispatch({ type: 'SHOW_COUNTRY_DROPDOWN' }),
  hideCountryDropdownEvent: () => dispatch({ type: 'HIDE_COUNTRY_DROPDOWN' }),
  showAboutEvent: () => dispatch({ type: 'SHOW_ABOUT' }),
  hideAboutEvent: () => dispatch({ type: 'HIDE_ABOUT' }),
  showFavoritesMenuEvent: () => dispatch({ type: 'SHOW_FAVORITES_MENU' }),
  hideFavoritesMenuEvent: () => dispatch({ type: 'HIDE_FAVORITES_MENU' }),
  removeTrackFromSpotifyQueue: track => dispatch(removeTrackFromSpotifyQueue(track)),
  showTopMenuEvent: () => dispatch({ type: 'SHOW_TOP_MENU' }),
  hideTopMenuEvent: () => dispatch({ type: 'HIDE_TOP_MENU' }),
  setSpotifySyncHandler: sync => dispatch({ type: 'SET_SPOTIFY_SYNC', sync }),
  addTrackToSpotifyQueue: track => dispatch(addTrackToSpotifyQueue(track)),
  handleExpandClick: track => dispatch(showLightbox(track)),
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
    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.toggleCountryDropdown = this.toggleCountryDropdown.bind(this);
    this.toggleQueueMenu = this.toggleQueueMenu.bind(this);
    this.toggleAbout = this.toggleAbout.bind(this);
    this.removeTrackFromQueue = this.removeTrackFromQueue.bind(this);
    this.toggleTopMenu = this.toggleTopMenu.bind(this);
  }

  componentDidMount() {
    const storedPlaylist = window.sessionStorage.getItem('playlist');
    if(storedPlaylist === null) {
      this.getPlaylist();
    } else {
      this.props.setPlaylist(JSON.parse(storedPlaylist));
    }
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
    .then(() => {
      const sweetScroll = new SweetScroll();
      console.log('scrolling down')
      const height = this.props.windowHeight - 62;
      console.log([0, this.props.windowHeight - 62]);
      sweetScroll.to(height, 0);
    })
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

  toggleUserMenu() {
    if (this.props.showUserMenu) this.props.hideUserMenuEvent();
    if (!this.props.showUserMenu) this.props.showUserMenuEvent();
  }

  toggleCountryDropdown() {
    if (this.props.showCountryDropdown) this.props.hideCountryDropdownEvent();
    if (!this.props.showCountryDropdown) this.props.showCountryDropdownEvent();
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
          toggleUserMenu={this.toggleUserMenu}
          showFavoritesMenu={this.props.showFavoritesMenu}
        />

        <FavoritesMenu
          showFavoritesMenu={this.props.showFavoritesMenu}
          favorites={this.props.favorites}
          showQueueMenu={this.props.showQueueMenu}
          windowHeight={this.props.windowHeight}
          showAvailableDevices={this.props.showAvailableDevices}
          showPlayerMobileOptions={this.props.showPlayerMobileOptions}
          toggleFavoritesMenu={this.toggleFavoritesMenu}
          sync={this.props.sync}
          setSpotifySyncHandler={this.props.setSpotifySyncHandler}
          addTrackToSpotifyQueue={this.props.addTrackToSpotifyQueue}
          handleExpandClick={this.props.handleExpandClick}
          helperFuncs={this.props.helperFuncs}

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
