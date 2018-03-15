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
import history from 'utils/history';

const {generateCode} = require('dhis2-uid');

class ReplyCard extends Component {
  state = {
    subject: '',
    input: '',
  }

  subjectUpdate = (event, newValue) => {
    this.setState({subject: newValue})
  }

  inputUpdate = (event, newValue) => {
    this.setState({input: newValue})
  }

  sendMessage = () => {
    const messageType = _.find(this.props.messageTypes, { id: 'PRIVATE' });
    this.props.sendMessage( this.state.subject, this.props.recipients, this.state.input, generateCode(), messageType)
  }

  wipeInput = () => {
    this.setState({subject: '', input: ''})
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
              hintText="Subject" 
              fullWidth
              value={this.state.subject}  
              onChange={this.subjectUpdate}
            />
            <TextField
              key={'createMessage'}
              id={'createMessage'}
              rows={5}
              underlineShow={false}
              value={this.state.input}
              multiLine
              fullWidth
              onChange={this.inputUpdate}
            />
            <CardActions>
              <FlatButton label="Send" 
                onClick={() => {
                  this.sendMessage()
                  history.push( '/PRIVATE' )
                }} 
              />
              <FlatButton label="Discard" onClick={ () => history.push( '/PRIVATE' ) }/>
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
        messageTypes: state.messaging.messageTypes,
        recipients: state.recipient.selected
      }
    },
    dispatch => ({
      sendMessage: (subject, users, message, messageConversationId, messageType) => dispatch({ type: actions.SEND_MESSAGE, payload: {subject, users, message, messageConversationId, messageType} }),
    }),
  ),
  pure,
)(ReplyCard);