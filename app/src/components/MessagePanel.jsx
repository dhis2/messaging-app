import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Subheader from 'material-ui/Subheader/Subheader';

const moment = require('moment');

const styles = {
  container: {
    flex: 1,
    gridColumn: '3',
    width: '100%',
    height: '100vh',
    alignItems: 'flex-start',
  },
  cardItem: {
    flex: 1,
    marginLeft: '20px',
    marginRight: '20px', 
  },
  subheader: {
    color: theme.palette.accent3Color,
    marginLeft: '20px',
    fontSize: '20px',
  }
};

class MessagePanel extends Component {
  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    const messageConversation = _.find(this.props.selectedMessageTypeConversations, { id: id });

    return (
        <div style={styles.container}>
          <List>
            { !messageConversation && <Subheader style={styles.subheader}>Select a message</Subheader> }          
            { messageConversation && <Subheader style={styles.subheader}> {messageConversation.subject} </Subheader> }
            {
              messageConversation && messageConversation.messages.map(message => {
                const title = messageConversation.messageType == 'PRIVATE' ? message.sender.displayName : messageConversation.messageType;

                return (
                  <div key={message.id} >
                    <Card style={styles.cardItem} key={message.id}>
                      <CardHeader
                        title={title}
                        subtitle={moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')}
                      />
                      <CardText>
                        {message.text}
                      </CardText>
                    </Card>
                  </div>
                )
              })
            }
          </List>
        </div>
      )
  }
}

export default compose(
  connect(
    state => {
      return {
        messageConversations: state.messaging.messageConversations,
      };
    },
    dispatch => ({
    }),
  ),
  pure,
)(MessagePanel);