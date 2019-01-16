import React, { PureComponent } from 'react';
import particleConfig from '../../../../particlesjs-config.json';

class GlobeMenu extends PureComponent {
  componentDidMount() {
    particlesJS('particles', particleConfig);
  }

  render() {
    return (
      <div id="particles" />
    );
  }
}

export default GlobeMenu;
