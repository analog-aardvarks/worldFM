import React from 'react';
import ReactDOM from 'react-dom';
import { slide as Menu } from 'react-burger-menu'

const BurgerMenu = () => {
  return (
    <div className="SideMenu">
      <span href="/">Home</span>
      <span href="/about">About</span>
      <span href="/country">Country</span>
      <span href="/genre">Genre</span>
      <span href="/categories">Categories</span>
      <span href="/about">Settings</span>
      <span href="/login">Login</span>
    </div>
  );
};
export default BurgerMenu;
