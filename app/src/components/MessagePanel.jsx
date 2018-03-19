import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom'

import ReplyCard from './ReplyCard'
import CreateMessage from './CreateMessage'

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { cardStyles, messagePanelContainer } from '../styles/style';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';

import Subheader from 'material-ui/Subheader/Subheader';

const moment = require('moment');

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
          : !this.props.wideview && <Subheader style={cardStyles.subheader}>{!messageConversation && 'Select a message'}</Subheader>
        }
        {messageConversation && <Subheader style={cardStyles.subheader}> {messageConversation.subject} </Subheader>}
        {messageConversation && <div>
          <List style={{padding: '0px'}}>
            {messageConversation.messages.map(message => {
              const title = messageConversation.messageType == 'PRIVATE' ? message.sender.displayName : messageConversation.messageType;
              return (
                <div key={message.id} >
                  <Card style={cardStyles.cardItem} key={message.id} >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}>
                      <CardHeader
                        title={title}
                        subtitle={moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')}
                      >
                      </CardHeader>
                    </div>

                    <CardText>
                      {message.text}
                    </CardText>
                  </Card>
                </div>
              )
            })
            }
          </List>
          {messageConversation.messageType == 'PRIVATE' && <ReplyCard messageConversation={messageConversation} />}
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