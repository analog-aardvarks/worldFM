import React from 'react';

const FavoritesMenu = ({ showFavoritesMenu }) => {

  return (
    <div className="FavoritesMenu" style={{ display:  showFavoritesMenu ? "block" : "none" }}>
      <span>Favorites</span>
    </div>
  )
}
export default FavoritesMenu;
