import React from 'react';
import { connect } from 'react-redux';
import { setPlaylist, setCurrentCountry, setCurrentTrend } from '../actions';

// I'll leave this here for now...
const availableTrends = 'Mix,Current,Emerging,Underground'.split(',');
const AsiaPacific = 'Australia,Japan,Hong Kong,Indonesia,Malaysia,New Zealand,Philippines,Singapore,Taiwan'.split(',');
const Europe = 'Andorra,Austria,Belgium,Bulgaria,Cyprus,Czech Republic,Denmark,Estonia,Finland,France,Germany,Greece,Hungary,Iceland,Ireland,Italy,Latvia,Liechtenstein,Lithuania,Luxembourg,Malta,Monaco,Netherlands,Norway,Poland,Portugal,Slovakia,Spain,Sweden,Switzerland,Turkey,UK'.split(',');
const America = 'Argentina,Bolivia,Brazil,Canada,Chile,Colombia,Costa Rica,Dominican Republic,Ecuador,El Salvador,Guatemala,Honduras,Mexico,Nicaragua,Panama,Paraguay,Peru,Uruguay,USA'.split(',');
const availableCountries = AsiaPacific.concat(Europe.concat(America)).sort();
availableCountries.unshift('World');

const mapStateToProps = (state) => ({
  currentCountry: state.currentCountry,
  currentTrend: state.currentTrend,
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentCountry: (country) => dispatch(setCurrentCountry(country)),
  setCurrentTrend: (trend) => dispatch(setCurrentTrend(trend)),
  setPlaylist: (playlist) => dispatch(setPlaylist(playlist)),
});

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTrendChange = this.handleTrendChange.bind(this);
  }

  componentDidMount() {
    this.getPlaylist();
  }

  componentDidUpdate() {
    this.getPlaylist();
  }

  handleCountryChange(e) {
    this.props.setCurrentCountry(e.target.value);
  }

  handleTrendChange(e) {
    this.props.setCurrentTrend(e.target.value);
  }

  getPlaylist(e) {
    // TODO use axios
    fetch(`http://localhost:8080/playlist?country=${this.props.currentCountry}&trend=${this.props.currentTrend}`)
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.props.setPlaylist(res);
      });
  }

  render() {
    return (
      <div className="Menu">
        <i className="Mobile--icon fa fa-bars fa-2x fa-fw"></i>
        <h1 className='Menu--logo'>world.fm</h1>
        <div className="Desktop">
          <label>Pick a country!</label>
          <select
            className="Menu--dropdown"
            value={this.props.currentCountry}
            onChange={this.handleCountryChange}
          >
            {availableCountries.map((country, idx) => <option key={idx}>{country}</option>)}
          </select>

          <label>Pick a category!</label>
          <select
            className="Menu--dropdown"
            value={this.props.currentTrend}
            onChange={this.handleTrendChange}
          >
            {availableTrends.map((trend, idx) => <option key={idx}>{trend}</option>)}
          </select>
          <a className="Menu--login" href="/auth/spotify">Login</a>
        </div>
      </div>
    );
  }
}

Menu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default Menu;
