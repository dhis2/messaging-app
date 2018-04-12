import React, { Component } from 'react';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import { headerPositions } from '../styles/style'

const CustomFontIcon = ({ size, child, selectedValue, onClick, icon, tooltip }) => {
  return (
    <IconButton
      style={{
        ...headerPositions.first
      }}
      tooltip={tooltip}
      tooltipPosition="bottom-left"  
    >
      <FontIcon
        className="material-icons"
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()

          selectedValue != child.id && onClick(child)
        }}>
        {icon}
      </FontIcon>
    </IconButton>
  )
}

export default CustomFontIcon;