import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader/Subheader';

import * as actions from 'constants/actions';
import theme from '../styles/theme';
import { cardStyles } from '../styles/style';

const {generateCode} = require('dhis2-uid');

class ReplyCard extends Component {
  state = {
    subject: 'test',
    input: '',
  }

  texFieldUpdate = (event, newValue) => {
    this.setState({input: newValue})
  }

  sendMessage = () => {
    this.props.sendMessage( this.state.subject, this.props.recipients, this.state.input, generateCode())
    this.wipeInput()
  }

  wipeInput = () => {
    this.setState({input: '', expanded: false})
  }

  render() {
    return (
      <div>
        <Subheader style={cardStyles.subheader}> {'Create'}</Subheader>
        <Card
          style={cardStyles.replyItem}
        >
          <CardText>
            <SuggestionField label={'To'} messageConversation={this.props.messageConversation} />
            <TextField
              key={'createMessage'}
              id={'createMessage'}
              rows={5}
              underlineShow={false}
              value={this.state.input}
              multiLine
              fullWidth
              onChange={this.texFieldUpdate}
            />
            <CardActions>
              <FlatButton label="Send" onClick={this.sendMessage} />
              <FlatButton label="Discard" />
            </CardActions>
          </CardText>
        </Card>
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        recipients: state.recipient.selected
      }
    },
    dispatch => ({
      sendMessage: (subject, users, message, messageConversationId) => dispatch({ type: actions.SEND_MESSAGE, payload: {subject, users, message, messageConversationId} }),
    }),
  ),
  pure,
)(ReplyCard);