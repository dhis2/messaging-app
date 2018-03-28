import React, { Component } from 'react';

import Subheader from 'material-ui/Subheader/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const CustomDropDown = ({subheader, gridColumn, style, onChange, value, children}) => (
  <div>
    <Subheader style={{ paddingLeft: '24px' }}> {subheader} </Subheader>

    <DropDownMenu style={{
        gridColumn: gridColumn,
        width: '200px',
        ...style,
      }}
      onChange={onChange}
      value={value}
      anchorOrigin={
        { "horizontal": "left", "vertical": "bottom" }
      }
    >
      {children.map(child => {
        return child
      })}
    </DropDownMenu>
  </div>
)

export default CustomDropDown;