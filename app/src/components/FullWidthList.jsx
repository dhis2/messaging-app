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

import MessageConversation from './MessageConversation'

import * as actions from 'constants/actions';
import { tabsStyles, messagePanelContainer, cardStyles, grid } from '../styles/style';
import theme from '../styles/theme';

const statusList = [{ key: 'ALL', displayName: 'All' }, { key: 'OPEN', displayName: 'OPEN' }, { key: 'PENDING', displayName: 'PENDING' }, { key: 'SOLVED', displayName: 'SOLVED' }]
class FullWidthList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const displayMessageList = !this.props.wideview || this.props.pathname.split('/').length == 2
    const messageType = this.props.messageType;

    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 2 / span 1 / span 1'
    return (
      displayMessageList &&
      <div style={{
        gridArea: gridArea,
        ...messagePanelContainer
      }}>
        <MessageList
          children={this.props.children}
          messageType={messageType}
          loaded={this.props.loaded}
          wideview={this.props.wideview}
          selectedValue={id}
          markUnread={(child) => {
            this.props.markMessageConversationsUnread([child.id], messageType)
          }}
          deleteMessageConversations={(child) => {
            this.props.deleteMessageConversation(child.id, messageType)
          }} />
      </div>
    )
  }
}

const MessageList = ({ children, messageType, loaded, wideview, selectedValue, markUnread, deleteMessageConversations }) => {
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
                wideview={wideview}
                selectedValue={selectedValue}
                markUnread={markUnread}
                deleteMessageConversations={deleteMessageConversations} />
            </Tab>
          )
        })}
      </Tabs>
      :
      <TableComponent
        filter={'ALL'}
        children={children}
        messageType={messageType}
        loaded={loaded}
        wideview={wideview}
        selectedValue={selectedValue}
        markUnread={markUnread}
        deleteMessageConversations={deleteMessageConversations}
      />
  )
}

const TableComponent = ({ filter, children, messageType, loaded, wideview, selectedValue, markUnread, deleteMessageConversations }) => {
  return (
    (children && children.length != 0) ?
      children
        .filter(child => child.status == filter || filter == '' || filter == 'ALL')
        .map(child => {
          return (
            <MessageConversation
              key={child.id}
              messageConversation={child}
              wideview={wideview}
              selectedValue={selectedValue}
              markUnread={markUnread}
              deleteMessageConversations={deleteMessageConversations}
              expanded={false}
            />
          )
        })
      :
      <Subheader>No message conversations</Subheader>
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
      deleteMessageConversation: (messageConversationId, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATION, payload: { messageConversationId, messageType } }),
    }),
  ),
  pure,
)(FullWidthList);