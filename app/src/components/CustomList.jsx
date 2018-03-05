import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import InboxIcon from 'material-ui-icons/Inbox';
import {List, ListItem, makeSelectable} from 'material-ui/List';

import theme from '../styles/theme';

const CustomList = ({gridColumn, props, open, children}) => {
  const routeValue = gridColumn == 1 ? props.match.params.messageType : props.location.pathname.split('/').slice(-1)[0];
  const relativePath = gridColumn == 1 ? "/" : "/" + props.match.params.messageType + "/";

  return (
    <div style={{
        gridColumn: gridColumn + '',
        backgroundColor: theme.palette.canvasColor,
        zIndex: '1',
        boxShadow: '0px 0px 2px #444444',
        overflowY: 'scroll',
      }} 
    >
      {!props.loaded && gridColumn == 1 && 
          <CircularProgress color={theme.palette.primary2Color} />
      }
      {gridColumn == 1 && <ListItems selectedValue={routeValue} children={children} relativePath={relativePath} loaded={props.loaded} gridColumn={gridColumn} />}
      {gridColumn == 2 && <ListItems selectedValue={routeValue} children={children} relativePath={relativePath} loaded={props.loaded} gridColumn={gridColumn} />}
    </div>
  );
}

const ListItems = ({ selectedValue, children, relativePath, loaded, gridColumn }) => {
  const leftIcon = gridColumn == 1 ? <InboxIcon /> : undefined

  return <List>
    {!children && loaded && <Subheader>No message conversations</Subheader>}
    {children && children.map(child => {
      return (
        <div key={child.id}>
          <ListItem
            touchRippleColor={theme.palette.primary2Color}
            style={{
              backgroundColor: child.id == selectedValue ? theme.palette.primary2Color : theme.palette.canvasColor,
              color: child.id == selectedValue && gridColumn == 1 ? theme.palette.primary3Color : theme.palette.textColor,
              fontSize: '15px',
            }}
            primaryText={child.displayName}
            leftIcon={leftIcon}
            secondaryText={gridColumn == 2 &&
              <p>
                <span style={{ color: theme.palette.textColor }}>{child.lastSenderFirstname + ' ' + child.lastSenderSurname}</span> --
                  {' ' + child.messages[0].text}
              </p>
            }
            secondaryTextLines={2}
            containerElement={<Link to={relativePath + child.id} />}
          />
          <Divider inset={true} />
        </div>
      )
    })}
  </List>
}

export default CustomList;