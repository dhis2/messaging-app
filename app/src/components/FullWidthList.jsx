import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import Subheader from 'material-ui/Subheader/Subheader';
import { Tabs, Tab } from 'material-ui/Tabs'
import { List, ListItem } from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import CreateMessage from './CreateMessage'
import MessageListItem from './MessageListItem'
import MessageConversation from './MessageConversation'
import CustomListItem from './CustomListItem'

import * as actions from 'constants/actions';
import { tabsStyles, messagePanelListContainer, paperStyle } from '../styles/style';
import theme from '../styles/theme';

const statusList = [{ key: 'ALL', displayName: 'All' }, { key: 'OPEN', displayName: 'OPEN' }, { key: 'PENDING', displayName: 'PENDING' }, { key: 'SOLVED', displayName: 'SOLVED' }]
class FullWidthList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const messageType = this.props.messageType;

    return (
      <div style={messagePanelListContainer} id='fullWidthList'>
        {id == 'create' ?
          <CreateMessage />
          :
          id == messageType &&
            <MessageList 
              children={this.props.children} 
              messageType={messageType} 
              loaded={this.props.loaded}
              markUnread={(child) => {
                this.props.markMessageConversationsUnread( [child.id], messageType )
              }} />
        }
      </div>
    )
  }
}

const MessageList = ({ children, messageType, loaded, markUnread }) => {
  return (
    messageType == 'TICKET' ? 
    <Tabs inkBarStyle={{ backgroundColor: theme.palette.primary1Color }}>
      {statusList.map(status => {
        return (
          <Tab
            style={tabsStyles.tabItem}
            key={status.key}
            label={status.displayName}
          >
            <TableComponent
              filter={status.key} 
              children={children} 
              messageType={messageType} 
              loaded={loaded} 
              markUnread={markUnread} />
          </Tab>
        )
      })}
    </Tabs>
    :
    <TableComponent 
      filter={''} 
      children={children} 
      messageType={messageType} 
      loaded={loaded} 
      markUnread={markUnread} />
  )
}

const TableComponent = ({ filter, children, messageType, loaded, markUnread }) => {
  return (
    (children && children.length != 0) ?
      children
        .filter(child => child.status == filter || filter == '' || filter == 'ALL')
        .map(child => {
          return (
            <div >
              <MessageConversation 
                messageConversation={child} 
                expanded={false}
                showExpandButton={true}
              /> 
            </div>         
            /*<CustomListItem 
            primaryText={child.displayName} 
            secondaryText={
              <p>
                <span style={{ color: theme.palette.textColor }}>
                  {messageType != 'PRIVATE' ? messageType : child.lastSenderFirstname + ' ' + child.lastSenderSurname}
                </span> -- {' ' + child.subject}
              </p>
            }
          />
            <MessageListItem
              key={child.id}
              child={child}
              gridColumn={2} 
              relativePath={ messageType + '/' } 
              messageType={messageType}
              markUnread={markUnread} />*/
          )
        })
      :
      <Subheader >No message conversations</Subheader>
  )
}

export default compose(
  connect(
    state => {
      return {
        loaded: state.messaging.loaded,
        messageFilter: state.messaging.messsageFilter,
      };
    },
    dispatch => ({
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
    }),
  ),
  pure,
)(FullWidthList);