import React from 'react';
import { connect } from 'react-redux';
import { setPlaylist, setCurrentCountry, setCurrentTrend, closeSongMenu } from '../actions';
import availableCountries from '../constance/availableCountries';
import availableTrends from '../constance/availableTrends';
import TopMenu from '../components/TopMenu';
import CountryMenu from '../components/CountryMenu';

const mapStateToProps = state => ({
  currentCountry: state.currentCountry,
  currentTrend: state.currentTrend,
  availableCountries: availableCountries,
  availableTrends: availableTrends,
  showTrackInfo: state.showTrackInfo,
  showSpotifyPlaylist: state.showSpotifyPlaylist,
  showCountryMenu: state.showCountryMenu,
});

const mapDispatchToProps = dispatch => ({
  setCurrentCountry: (country) => dispatch(setCurrentCountry(country)),
  setCurrentTrend: (trend) => dispatch(setCurrentTrend(trend)),
  setPlaylist: (playlist) => dispatch(setPlaylist(playlist)),
  showTrackInfoEvent: () => dispatch({ type: 'SHOW_TRACK_INFO' }),
  hideTrackInfoEvent: () => dispatch({ type: 'HIDE_TRACK_INFO' }),
  showSpotifyPlaylistEvent: () => dispatch({ type: 'SHOW_SPOTIFY_PLAYLIST' }),
  hideSpotifyPlaylistEvent: () => dispatch({ type: 'HIDE_SPOTIFY_PLAYLIST' }),
  showCountryMenuEvent: () => dispatch({ type: 'SHOW_COUNTRY_MENU' }),
  hideCountryMenuEvent: () =>  dispatch({ type: 'HIDE_COUNTRY_MENU' }),
  closeSongMenu: () => dispatch(closeSongMenu()),
});

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTrendChange = this.handleTrendChange.bind(this);
    this.toggleTrackInfo = this.toggleTrackInfo.bind(this);
    this.toggleSpotifyPlaylist = this.toggleSpotifyPlaylist.bind(this);
    this.toggleCountryMenu = this.toggleCountryMenu.bind(this)
  }

  componentDidMount() {
    this.getPlaylist();
  }

  componentDidUpdate(prev) {
    // only getPlaylist if necessary
    if (prev.currentCountry !== this.props.currentCountry) {
      this.getPlaylist();
      this.props.closeSongMenu();
    } else if(prev.currentTrend !== this.props.currentTrend) {
      this.getPlaylist();
      this.props.closeSongMenu();
    }
  }

  handleCountryChange(e) {
    this.props.setCurrentCountry(e.target.value);
  }

  handleTrendChange(e) {
    this.props.setCurrentTrend(e.target.value);
    //console.log(e)
  }

  getPlaylist(e) {
    fetch(`http://localhost:8080/playlist?country=${this.props.currentCountry}&trend=${this.props.currentTrend}`)
      .then(res => res.json())
      .then(res => this.props.setPlaylist(res))
      .catch(err => console.log(err));
  }

  toggleTrackInfo() {
    //console.log(this.props.showTrackInfo)
    if(this.props.showTrackInfo) this.props.hideTrackInfoEvent();
    if(!this.props.showTrackInfo) this.props.showTrackInfoEvent();
  }

  toggleSpotifyPlaylist() {
    //console.log(this.props.showSpotifyPlaylist)
    if(this.props.showSpotifyPlaylist) this.props.hideSpotifyPlaylistEvent();
    if(!this.props.showSpotifyPlaylist) this.props.showSpotifyPlaylistEvent();
  }

  toggleCountryMenu() {
    console.log(this.props.showCountryMenu)
    if(this.props.showCountryMenu) this.props.hideCountryMenuEvent();
    if(!this.props.showCountryMenu) this.props.showCountryMenuEvent();
  }

  render() {
    return (
      <div>
        <TopMenu
          toggleCountryMenu={this.toggleCountryMenu}
          toggleSpotifyPlaylist={this.toggleSpotifyPlaylist}
          toggleTrackInfo={this.toggleTrackInfo}
        />
        <CountryMenu
          availableCountries={this.props.availableCountries}
          availableTrends={this.props.availableTrends}
          currentCountry={this.props.currentCountry}
          currentTrend={this.props.currentTrend}
          handleCountryChange={this.handleCountryChange}
          handleTrendChange={this.handleTrendChange}
          showCountryMenu={this.props.showCountryMenu}
        />
      </div>
    );
  }
}

Menu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
export default Menu;
