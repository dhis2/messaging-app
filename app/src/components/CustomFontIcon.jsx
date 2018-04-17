import React, { Component } from 'react';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const CustomFontIcon = ({ child, selectedValue, onClick, icon, tooltip }) => {
  return (
    <IconButton
      style={{
        marginTop: '0px',
        marginRight: '10px',
        padding: '0px',
        height: '30px',
      }}
      tooltip={tooltip}
      tooltipPosition="bottom-left"  
    >
      <FontIcon
        className="material-icons"
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()

          if ( child ) {
            selectedValue != child.id && onClick(child)
          } else onClick()
        }}>
        {icon}
      </FontIcon>
    </IconButton>
  )
}

export default CustomFontIcon;