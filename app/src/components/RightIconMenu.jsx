import React from 'react';

import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';

import theme from '../styles/theme';

const iconButtonElement = (
  <IconButton
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={theme.palette.accent3Color} />
  </IconButton>
);

const RightIconMenu = () => (
  <IconMenu style={{
    paddingRight: '95%'
  }} iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Mark</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
)

export default RightIconMenu;