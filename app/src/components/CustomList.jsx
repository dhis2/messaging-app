import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/Inbox';
import MarkUnreadIcon from 'material-ui-icons/MarkUnread';
import Badge from 'material-ui/Badge';
import {List, ListItem, makeSelectable} from 'material-ui/List';

import RightIconMenu from './RightIconMenu'

import theme from '../styles/theme';

const CustomList = ({gridColumn, props, open, children, loadMoreMessageConversations, markUnread}) => {
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
      <ListItems 
        messageType={props.match.params.messageType} 
        selectedValue={routeValue} children={children} 
        relativePath={relativePath} loaded={props.loaded} 
        gridColumn={gridColumn} 
        loadMoreMessageConversations={loadMoreMessageConversations} 
        markUnread={markUnread}/>
    </div>
  );
}



const ListItems = ({ messageType, selectedValue, children, relativePath, loaded, gridColumn, loadMoreMessageConversations, markUnread }) => {

  const leftIcon = gridColumn == 1 ? <InboxIcon /> : undefined
  const markUnreadComponent = (child) => (
    <MarkUnreadIcon onClick={(event) => {
      event.stopPropagation()
      event.preventDefault()

      selectedValue != child.id && markUnread(child)
    }} />
  )
  
  return (
    <List style={{ padding: '0px' }}>
      {!children && loaded && <Subheader >No message conversations</Subheader>}
      {children && children.map(child => {
        const rightIcon = gridColumn == 1 ? child.unread > 0 ? <Badge badgeContent={child.unread} secondary={true} badgeStyle={{backgroundColor: '#439E8E'}} /> : undefined : markUnreadComponent(child)

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
              secondaryTextLines={2}
              containerElement={<Link to={relativePath + child.id} />}
            />
            {gridColumn == 2 && <Divider /> }
          </div>
        )
      })}
      {children && children.length % 6 == 0 && <ListItem
              primaryText={'Load more messages'}
              onClick={() => loadMoreMessageConversations(messageType)}
            />}
    </List>
  );
}

export default CustomList;