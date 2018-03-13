import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid } from '../styles/style';

import CustomList from './CustomList';
import MessagePanel from './MessagePanel';

class MessagingCenter extends Component {
  componentWillMount() {
    this.props.messageTypes.map( messageType => {
      this.props.loadMessageConversations( messageType.id, messageType.page );
    })

    this.props.loadMessageConversationsFinished();
  }

  loadMoreMessageConversations( messageType ) {
    let messageTypeState = _.find(this.props.messageTypes, {id: messageType});
    this.props.loadMessageConversations( messageTypeState.id, messageTypeState.page + 1);
  }

  render() {
    const selectedMessageTypeConversations = this.props.messageConversations[this.props.match.params.messageType];

    return (
      <div style={grid} >
        <CustomList gridColumn={1} props={this.props} children={this.props.messageTypes} />
        <CustomList 
          gridColumn={2} 
          props={this.props} 
          children={selectedMessageTypeConversations} 
          loadMoreMessageConversations={this.loadMoreMessageConversations.bind(this)} 
          markUnread={(child) => {
            this.props.markMessageConversationsUnread( [child.id] )
          }}/>
        <MessagePanel gridColumn={3} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        messageTypes: state.messaging.messageTypes,
        messageConversations: state.messaging.messageConversations,
        loaded: state.messaging.loaded,
      };
    },
    dispatch => ({
      loadMessageConversations: (messageType, page) => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: {messageType, page} }),
      loadMessageConversationsFinished: () => dispatch({ type: actions.MESSAGE_CONVERSATIONS_LOAD_FINISHED }),
      markMessageConversationsUnread: markedUnreadConversations => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations } }),
    }),
  ),
  pure,
)(MessagingCenter);