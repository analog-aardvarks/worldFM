import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { setPlaylist } from '../actions';

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'Amdorra',
      data: ['Andorra', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Bolivia',
          'Brazil', 'Bulgaria', 'Canada', 'Chile', 'Costa Rica', 'Cyprus', 'Czech Republic',
          'Denmark','Dominican', 'Ecuador', 'El Salvador', 'Estonia', 'Finland', 'France',
          'Germany', 'Greece',  'Guatemala', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland',
          'Indonesia', 'Ireland', 'Italy', 'Japan', 'Latvia', 'Liechtenstein', 'Lithuania',
          'Luxembourg', 'Malaysia', 'Malta', 'Mexico',  'Monaco', 'Netherlands', 'New Zealand',
          'Nicaragua', 'Norway', 'Panama',  'Paraguay', 'Peru', 'Philippines', 'Poland',
          'Portugal', 'Republic', 'Singapore',  'Slovakia', 'Spain', 'Sweden', 'Switzerland',
          'Taiwan', 'Turkey', 'United Kingdom', 'United States', 'Uruguay']
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    fetch(`http://localhost:8080/playlist?country=${this.state.value}`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(res);
      console.log(this.props.setPlaylist);
      console.log('this is props', this.props)
      this.props.setPlaylist(res);
    });
  }

  // fetch(`http://localhost:8080/playlist?country=${this.state.value}&trend=Underground`)

  render() {
    return (
      <div className="Menu">
          <h1>world.fm</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              Pick your contry!
              <select className="DropDown" value={this.state.value} onChange={this.handleChange}>
                {this.state.data.map((playlist, idx) => <option key={idx}>{playlist}</option>)}
              </select>
            </label>
            <input className="DropDown" type="submit" value="Submit" />
          </form>
          <a className="Login" href="/auth/spotify">Login</a>
      </div>
    );
  }
}

const mapStateToProps = () => ({

})

export default connect(mapStateToProps, {setPlaylist})(Menu);
