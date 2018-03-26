import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom'

import CreateMessage from './CreateMessage'
import MessageConversation from './MessageConversation'

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';

class MessagePanel extends Component {
  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const messageConversation = _.find(this.props.selectedMessageTypeConversations, { id: id });

    if (messageConversation && !messageConversation.read) {
      this.props.markMessageConversationsRead([messageConversation.id], messageConversation.messageType)
    }

    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 3 / span 1 / span 1'
    return (
      messageConversation ?
      <div 
        id='messagepanel'
        style={{
          overflowY: 'scroll',
          overflowX: 'hidden',
          gridArea: gridArea,
          height: 'calc(100vh - 100px)',
          margin: '10px',
        }}
      >
          <MessageConversation
            messageConversation={messageConversation}
            disableLink={true}
          />
      </div>
      : <div/>
    )
  }
}

export default compose(
  connect(
    state => {
      return state
    },
    dispatch => ({
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
    }),
  ),
  pure,
)(MessagePanel);