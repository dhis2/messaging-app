import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader/Subheader';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import MessageListItem from './MessageListItem'

import theme from '../styles/theme';
import * as actions from 'constants/actions';

/*const mapChildren = gridColumn == 2 ? _.filter( children, (child) => {
   return (
     child.displayName.includes(messageFilter) &&
     messageType != 'PRIVATE' && _.filter(child.messages, (message) => {
       message.sender.displayName.includes(messageFilter) &&
         message.text.includes(messageFilter)
     })
   )
 }) : children*/

class SidebarList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const gridColumn = this.props.gridColumn;
    const messageType = this.props.match.params.messageType;
    const routeValue = gridColumn == 1 ? messageType : this.props.location.pathname.split('/').slice(-1)[0];
    const relativePath = gridColumn == 1 ? "/" : "/" + messageType + "/";
    const children = this.props.children;

    const loading = _.find(this.props.messageTypes, {id: messageType}).loading

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 95px)',
        gridColumn: gridColumn + '',
        gridRow: '2',
        borderLeftStyle: gridColumn == 2 && 'solid',
        borderLeftWidth: '0.5px',
        borderLeftColor: theme.palette.accent4Color,
        overflowY: 'scroll'
      }}
      >
        <div>
          <List style={{
            padding: '0px',
            height: 'calc(100vh - 100px)',
          }} >
            {(!children || children.length == 0) && this.props.loaded && <Subheader >No message conversations</Subheader>}
            {children &&
              children.map(child => {
                return (
                  <div key={child.id}>
                    <MessageListItem
                      child={child}
                      gridColumn={gridColumn}
                      selectedValue={routeValue}
                      relativePath={relativePath}
                      messageType={messageType}
                      loading={loading}
                      markUnread={(child) => {
                        this.props.markMessageConversationsUnread([child.id], messageType)
                      }} />
                    <Divider />
                  </div>
                )
              })}
          </List>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => {
      return {
        messageTypes: state.messaging.messageTypes,
        messageFilter: state.messaging.messsageFilter,
      };
    },
    dispatch => ({
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
    }),
  ),
  pure,
)(SidebarList);