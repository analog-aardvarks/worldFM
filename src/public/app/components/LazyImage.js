import React, { PureComponent } from 'react';

import LazyLoad from 'react-lazyload';

class LazyImage extends PureComponent {

  state = {
    isLoaded: false
  }

  setLoaded = () => this.setState({ isLoaded: true })

  render() {
    const { src, alt, className } = this.props
    const { isLoaded } = this.state
    return (
      <div>
        <div className={`lazy-image__placeholder${isLoaded ? ' is-loaded' : ''}`}>...</div>
        <LazyLoad
          once
          height="100%"
          offset={500}
        >
          <img
            src={src}
            alt={alt}
            className={`${className} lazy-image${isLoaded ? ' is-loaded' : ''}`}
            onLoad={this.setLoaded}
          />
        </LazyLoad>
      </div>
    );
  }
}

export default LazyImage;
