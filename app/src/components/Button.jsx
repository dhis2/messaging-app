import React, { Component } from 'react';
import { colors, fonts } from '../styles/theme.js'

class Button extends Component {
  state = {
    pressed: false,
    hover: false,
  }

  constructor(props) {
    super(props)
  }

  getBackgroundColor() {
    if (this.props.selected) {
      return this.state.pressed ?
        colors.accentLighter : colors.accent
    } else {
      if (!this.props.homeButton) {
        return this.state.pressed ?
          colors.wetasphalt : this.state.hover ?
            colors.grayLight : colors.gray
      } else {
        return colors.wetasphalt
      }
    }
  }

  render() {
    return (
      <div
        onClick={() => this.props.onClick()}
        onMouseDown={() => this.setState({ pressed: true })}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false, pressed: false })}
        onMouseUp={() => this.setState({ pressed: false })}
        style={{
          alignItems: 'center',
          backgroundColor: this.getBackgroundColor(),
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          fontSize: fonts.large,
          fontWeight: 600,
          height: 40,
          justifyContent: 'flex-start',
          paddingLeft: 20,
          textAlign: 'center',
          userSelect: 'none',
        }}>
        {this.props.text.value}
      </div>
    )
  }
}

export default Button
