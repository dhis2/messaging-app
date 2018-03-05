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
  const routeValue = gridColumn == 1 ? props.match.params.messageType : props.match.params.messageConversationId;
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
      <List>
        {!props.loaded && gridColumn == 1 && 
            <CircularProgress color={theme.palette.primary2Color} />
        }
        {gridColumn == 1 && <MessageTypeItems selectedValue={routeValue} children={children} relativePath={relativePath} />}
        {gridColumn == 2 && <MessageConversationItems loaded={props.loaded} selectedValue={routeValue} children={children} relativePath={relativePath} />}
      </List>
    </div>
  );
}

const MessageTypeItems = ({ selectedValue, children, relativePath }) => {
  return <Menu
    selectedMenuItemStyle={{
      backgroundColor: theme.palette.primary2Color,
      color: theme.palette.primary3Color
    }}
    value={selectedValue}
  >
    {children.map(child => {
      return <MenuItem
        style={{
          fontSize: '15px',
        }}
        key={child.key}
        value={child.key}
        leftIcon={
          <InboxIcon />
        }
        primaryText={child.text}
        containerElement={<Link to={relativePath + child.key} />}
      />
    })}
  </Menu>
}

const MessageConversationItems = ({ selectedValue, children, relativePath, loaded }) => {
  return <List value={selectedValue} >
      {!children && loaded && <Subheader>No message conversations</Subheader>}
      {children && children.map(child => {
        return (
          <div value={child.id} key={child.id}>
            <ListItem
              value={child.id}
              primaryText={child.displayName}
              secondaryText={
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