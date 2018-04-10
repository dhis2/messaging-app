import React, { Component } from 'react';

import Subheader from 'material-ui/Subheader/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const CustomDropDown = ({subheader, gridColumn, onChange, value, children}) => (
  <div style={{
    gridArea: '1 / ' + gridColumn,
    width: '200px',
  }}>
    <Subheader style={{ paddingLeft: '24px' }}> {subheader} </Subheader>

    <DropDownMenu 
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