import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {List, ListItem} from 'material-ui/List';

import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/Inbox';
import Badge from 'material-ui/Badge';
import MarkUnreadIcon from 'material-ui-icons/MarkUnreadMailBox';

import theme from '../styles/theme';

const ListItems = ({ messageType, messageFilter, selectedValue, children, relativePath, loaded, gridColumn, loadMoreMessageConversations, markUnread }) => {
  const leftIcon = gridColumn == 1 ? <InboxIcon /> : undefined
  const markUnreadComponent = (child) => (
    <MarkUnreadIcon onClick={(event) => {
      event.stopPropagation()
      event.preventDefault()

      selectedValue != child.id && markUnread(child)
    }} />
  )

  /*const mapChildren = gridColumn == 2 ? _.filter( children, (child) => {
    return (
      child.displayName.includes(messageFilter) &&
      messageType != 'PRIVATE' && _.filter(child.messages, (message) => {
        message.sender.displayName.includes(messageFilter) &&
          message.text.includes(messageFilter)
      })
    )
  }) : children*/
  
  return (
    <List style={{ padding: '0px', height: 'calc(100vh - 100px)' }} >
      {(!children || children.length == 0) && loaded && <Subheader >No message conversations</Subheader>}
      {children &&
        children.map(child => {
          const rightIcon = gridColumn == 1 ? child.unread > 0 ? <Badge badgeContent={child.unread} secondary={true} badgeStyle={{ backgroundColor: '#439E8E' }} /> : undefined : markUnreadComponent(child)

          return (
            <div key={child.id}>
              <ListItem
                touchRippleColor={theme.palette.primary2Color}
                style={{
                  borderLeftStyle: !child.read && gridColumn == 2 ? 'solid' : '',
                  borderLeftColor: theme.palette.primary1Color,
                  backgroundColor: child.id == selectedValue ? theme.palette.primary2Color : theme.palette.canvasColor,
                  color: child.id == selectedValue && gridColumn == 1 ? theme.palette.primary3Color : theme.palette.textColor,
                  fontSize: '15px',
                }}
                primaryText={child.displayName}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                secondaryText={gridColumn == 2 &&
                  <p>
                    <span style={{ color: theme.palette.textColor }}>
                      {messageType != 'PRIVATE' ? messageType : child.lastSenderFirstname + ' ' + child.lastSenderSurname}
                    </span> -- {' ' + child.subject}
                  </p>
                }
                secondaryTextLines={1}
                containerElement={<Link to={relativePath + child.id} />}
              />
              {gridColumn == 2 && <Divider />}
            </div>
          )
        })}
      {children && children.length % 5 == 0 && children.length > 0 && <ListItem
        primaryText={'Load more messages'}
        onClick={() => loadMoreMessageConversations(messageType)}
      />}
    </List>
  );
}

export default ListItems;