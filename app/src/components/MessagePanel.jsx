import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom'

import CreateMessage from './CreateMessage'
import MessageConversation from './MessageConversation'

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { cardStyles, messagePanelContainer } from '../styles/style';

import MailIcon from 'material-ui-icons/MailOutline';

import Subheader from 'material-ui/Subheader/Subheader';

class MessagePanel extends Component {
  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const messageConversation = _.find(this.props.selectedMessageTypeConversations, { id: id });

    if (messageConversation && !messageConversation.read) {
      this.props.markMessageConversationsRead([messageConversation.id], messageConversation.messageType)
    }

    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 3 / span 1 / span 1'
    return (
      <div style={{
        gridArea: gridArea,
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}>
        {id == 'create' ?
          <Subheader style={cardStyles.subheader}>{!messageConversation && 'Create'}</Subheader> &&
          <CreateMessage />
          : !this.props.wideview && 
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <Subheader style={cardStyles.subheader}>{!messageConversation && 'Select a message'}</Subheader>
            <MailIcon style={{
              color: theme.palette.primary1Color, 
              width: 120,
              height: 120,
              }}/>
          </div>
        }
        {messageConversation && <Subheader style={cardStyles.subheader}> {messageConversation.subject} </Subheader>}
        {messageConversation && <div>
          <MessageConversation 
            messageConversation={messageConversation} 
            showExpandButton={false}
          />
        </div>}
      </div>
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