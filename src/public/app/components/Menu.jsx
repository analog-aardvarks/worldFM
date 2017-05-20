import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {
  render() {
    return (
      <div className="Menu">
        <h1>world.fm</h1>
        <a className="Login" href="/auth/spotify">Login</a>
      </div>
    );
  }
}

export default Menu
