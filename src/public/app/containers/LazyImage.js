import React, { Component } from 'react'
import { connect } from 'react-redux'
import { omit } from 'underscore'

class LazyImage extends Component {
  state = {
    isLoaded: false,
  }

  shouldComponentUpdate() {
    return !this.state.isLoaded;
  }

  componentDidUpdate() {
    if (this.state.isLoaded) return

    const { y } = this.img.getBoundingClientRect()
    if (y <= this.props.windowHeight) {
      this.setState({ isLoaded: true })
    }
  }

  setRef = img => {
    this.img = img;
  }

  render() {
    console.log(this.props.windowHeight)
    return (
      this.state.isLoaded ? (
        <img
          src={this.state.isLoaded ? this.props.src : ''}
          {...omit(this.props, ['windowHeight', 'scrollY', 'src'])}
          ref={this.setRef}
        />
      ) : (
        <div
          className={this.props.className}
          style={{ background: '#faa' }}
          ref={this.setRef}
        />
      )
    )
  }
}

const mapStateToProps = ({ windowHeight, scrollY }) => ({ windowHeight, scrollY });

export default connect(mapStateToProps)(LazyImage);
