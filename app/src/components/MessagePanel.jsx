import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom'

import RightIconMenu from './RightIconMenu'
import ReplyCard from './ReplyCard'
import CreateMessage from './CreateMessage'

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { cardStyles } from '../styles/style';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

import Subheader from 'material-ui/Subheader/Subheader';

const moment = require('moment');

class MessagePanel extends Component {
  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const messageConversation = _.find(this.props.selectedMessageTypeConversations, { id: id });

    if ( messageConversation && !messageConversation.read ) {
      this.props.markMessageConversationsRead( [messageConversation.id] )
    }

    return (
      <div style={cardStyles.container}>
        { id == 'create' && <CreateMessage /> }
        { id != 'create' && <Subheader style={cardStyles.subheader}>{ !messageConversation && 'Select a message'}</Subheader>}
        {messageConversation && <div>
          <List>
            <Subheader style={cardStyles.subheader}> {messageConversation.subject} </Subheader>
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
                      <CardActions>
                        <RightIconMenu />
                      </CardActions>
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
          {messageConversation.messageType == 'PRIVATE' && <ReplyCard messageConversation={messageConversation}/> }
        </div>
        }
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
      markMessageConversationsRead: markedReadConversations => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations } }),
    }),
  ),
  pure,
)(MessagePanel);