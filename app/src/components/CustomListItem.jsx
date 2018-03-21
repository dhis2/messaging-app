import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

const CustomListItem = ({ primaryText, secondaryText, messageType }) => {
  return (
    <Paper>
      <div>
        <div> {primaryText} </div>
        <div> {secondaryText} </div>
      </div>
    </Paper>
  )
}

export default CustomListItem