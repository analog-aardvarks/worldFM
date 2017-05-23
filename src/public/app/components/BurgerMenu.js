import React from 'react';
import ReactDOM from 'react-dom';
import { slide as Menu } from 'react-burger-menu'

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
}

render () {
  return (
    <BurgerMenu>
      <a id= "home" className= "menu-item" href="/">Home</a>
      <a id="about" className="menu-item" href="/about">About</a>
      <a id="country" className="menu-item" href="/country">Country</a>
      <a id="genre" className="menu-item" href="/genre">Genre</a>
      <a id="categories" className="menu-item" href="/categories">Categories</a>
      <a id="settings" className="menu-item" href="/about">Settings</a>
      <a id="login" className="menu-item" href="/login">Login</a>
    </BurgerMenu>
  );
}
