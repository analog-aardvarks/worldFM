// REFACTOR
//
// INTO NAVBAR AND SIDEBAR
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { setPlaylist } from '../actions';

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // TODO MOVE TO store
      country: 'Andorra',
      countries: ['Andorra', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Bolivia',
          'Brazil', 'Bulgaria', 'Canada', 'Chile', 'Costa Rica', 'Cyprus', 'Czech Republic',
          'Denmark','Dominican Republic', 'Ecuador', 'El Salvador', 'Estonia', 'Finland', 'France',
          'Germany', 'Greece',  'Guatemala', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland',
          'Indonesia', 'Ireland', 'Italy', 'Japan', 'Latvia', 'Liechtenstein', 'Lithuania',
          'Luxembourg', 'Malaysia', 'Malta', 'Mexico',  'Monaco', 'Netherlands', 'New Zealand',
          'Nicaragua', 'Norway', 'Panama',  'Paraguay', 'Peru', 'Philippines', 'Poland',
          'Portugal', 'Singapore',  'Slovakia', 'Spain', 'Sweden', 'Switzerland',
          'Taiwan', 'Turkey', 'United Kingdom', 'USA', 'Uruguay'],
        category: 'Mix',
        categories: ['Mix', 'Current', 'Emerging', 'Underground']
    }

    // dispatch actions
    // SET_COUNTRY
    // SET_TREND
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCountryChange(event) {
    console.log('this is the target value for country', event.target.value)
    this.state.country = event.target.value;
    this.handleSubmit();
  }

  handleCategoryChange(event) {
    console.log('this is the target value for category', event.target.value)
    this.state.category = event.target.value;
    this.handleSubmit();
  }

  handleSubmit(event) {
    console.log(`http://localhost:8080/playlist?country=${this.state.country}&trend=${this.state.category}`);
    fetch(`http://localhost:8080/playlist?country=${this.state.country}&trend=${this.state.category}`)
    .then(res => {
      this.forceUpdate();
      return res.json();
    })
    .then(res => {
      this.props.setPlaylist(res);
    });
  }

  render() {
    return (
      <div className="Menu">
        <h1 className='Menu--logo'>world.fm</h1>

            <label>
              Pick your country!
            </label>
            <select className="DropDown" value={this.state.country} onChange={this.handleCountryChange}>
              {this.state.countries.map((playlist, idx) => <option key={idx}>{playlist}</option>)}
            </select>

            <label>
              Pick your category!
            </label>
            <select
              className="DropDown"
              value={this.state.category}
              onChange={this.handleCategoryChange}
            >
              {this.state.categories.map((category, idx) => <option key={idx}>{category}</option>)}
            </select>

          <a className="Login" href="/auth/spotify">Login</a>
      </div>
    );
  }
}

const mapStateToProps = () => ({

})

export default connect(mapStateToProps, {setPlaylist})(Menu);
