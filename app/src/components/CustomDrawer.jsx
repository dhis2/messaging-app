import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import InboxIcon from 'material-ui-icons/Inbox';
import {List, ListItem, makeSelectable} from 'material-ui/List';

import theme from '../styles/theme';

const CustomDrawer = ({drawerLevel, props, open, children}) => {
  const routeValue = drawerLevel == 0 ? props.match.params.messageType : props.match.params.messageConversationId;
  const relativePath = drawerLevel == 0 ? "/" : "/" + props.match.params.messageType + "/";

  return (
    <div >
      <Drawer
        containerStyle={{
          left: 'calc(' + (15 * drawerLevel) + '%)',
          height: 'calc(100% - 49px)',
          width: drawerLevel == 0 ? '15%' : '22%',
          top: 49
        }}
        open={open}
      >
        {drawerLevel == 0 && <MessageTypeItems selectedValue={routeValue} children={children} relativePath={relativePath} />}
        {drawerLevel == 1 && <MessageConversationItems selectedValue={routeValue} children={children} relativePath={relativePath} />}
      </Drawer>
    </div>
  );
}

const MessageTypeItems = ({ selectedValue, children, relativePath }) => {
  return <Menu
    selectedMenuItemStyle={{
      backgroundColor: theme.palette.primary2Color,
      color: theme.palette.primary3Color
    }
    }
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

let SelectableList = makeSelectable(List);
const MessageConversationItems = ({ selectedValue, children, relativePath }) => {
  return <List value={selectedValue} >
      {children.map(child => {
        return (
          <div>
            <ListItem
              value={child.id}
              key={child.id}
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

export default CustomDrawer;