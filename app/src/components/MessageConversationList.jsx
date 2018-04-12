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

import MessageConversationListItem from './MessageConversationListItem'

import * as actions from 'constants/actions';
import { tabsStyles, messagePanelContainer, cardStyles, grid } from '../styles/style';
import theme from '../styles/theme';

const statusList = [{ key: 'ALL', displayName: 'All' }, { key: 'OPEN', displayName: 'Open' }, { key: 'PENDING', displayName: 'Pending' }, { key: 'INVALID', displayName: 'Invalid' }, { key: 'SOLVED', displayName: 'Solved' }]
const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversationList extends Component {
  constructor(props) {
    super(props)
  }

  isBottom = (el) => {
    return (el.scrollHeight - el.scrollTop) < window.outerHeight
  }

  onScroll = (messageType) => {
    const messageList = document.getElementById('messagelist');
    if (this.isBottom(messageList) && messageType.loaded < messageType.total) {
      this.props.loadMessageConversations(messageType.id, messageType.page + 1)
    }
  }

  render() {
    const displayMessageList = !this.props.wideview || this.props.selectedMessageConversation == undefined;

    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 2 / span 1 / span 1'
    return (
      displayMessageList ?
      <div
        id={'messagelist'}
        onScroll={() => this.onScroll(this.props.selectedMessageType)}
        style={{
          gridArea: gridArea,     
          ...messagePanelContainer
        }}>
        <MessageList
          children={this.props.messageConversations[this.props.selectedMessageType.id]}
          messageType={ this.props.selectedMessageType ? this.props.selectedMessageType.id : ''}
          loaded={this.props.loaded}
          wideview={this.props.wideview}
          selectedValue={this.props.selectedMessageConversation ? this.props.selectedMessageConversation.id : ''} />
      </div>
      :
      <div/>
    )
  }
}

const MessageList = ({ children, messageType, loaded, wideview, selectedValue }) => {
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
                selectedValue={selectedValue} />
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
      />
  )
}

const TableComponent = ({ filter, children, messageType, loaded, wideview, selectedValue }) => {
  const notification = !!(NOTIFICATIONS.indexOf(messageType) + 1)
  return (
    (children && children.length != 0) ?
      children
        .filter(child => child.status == filter || filter == 'ALL')
        .map(child => {
          return (
            <MessageConversationListItem
              key={child.id}
              messageConversation={child}
              wideview={wideview}
              selectedValue={selectedValue}
              expanded={false}
              notification={notification}
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
        messageTypes: state.messaging.messageTypes,
        messageConversations: state.messaging.messageConversations,
        selectedMessageConversation: state.messaging.selectedMessageConversation,
        selectedMessageType: state.messaging.selectedMessageType,
        loaded: state.messaging.loaded,
        messageFilter: state.messaging.messsageFilter,
      };
    },
    dispatch => ({
      loadMessageConversations: (messageType, page) => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: { messageType, page } }),
    }),
  ),
  pure,
)(MessageConversationList);