import React, { PureComponent } from 'react';
import particleConfig from '../../../../particlesjs-config.json';

class Particles extends PureComponent {
  componentDidMount() {
    particlesJS('particles', particleConfig);
  }

  render() {
    return (
      <div id="particles" />
    );
  }
}

export default Particles;
