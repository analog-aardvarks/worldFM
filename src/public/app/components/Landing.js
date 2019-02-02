import React, { Component } from 'react';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.classNamePrefix = 'landing';
  }

  render() {
    const { handleToggleDisplayLanding } = this.props;

    return (
      <div className={this.classNamePrefix}>

        <div className={`${this.classNamePrefix}__greeting`}>
          <img src="../../assets/worldfmlogo.svg" alt="worldfm logo" />

          <span className={`${this.classNamePrefix}__subheader`}>explore the world of trending music</span>

          <span
            className={`${this.classNamePrefix}__continueButton`}
            onClick={() => handleToggleDisplayLanding()}
            role="button"
          >
            continue
          </span>
        </div>

      </div>
    );
  }
}

export default Landing;
