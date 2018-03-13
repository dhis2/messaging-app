import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import * as actions from 'constants/actions';
import theme from '../styles/theme';
import { cardStyles } from '../styles/style';

class ReplyCard extends Component {
  state = {
    input: '',
    expanded: false,
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  texFieldUpdate = (event, newValue) => {
    this.setState({input: newValue})
  }

  replyMessage = () => {
    this.props.replyMessage(this.state.input, this.props.messageConversation.id)
    this.wipeInput()
  }

  wipeInput = () => {
    this.setState({input: '', expanded: false})
  }

  render() {
    return (
      <Card
        style={cardStyles.replyItem}
        expanded={this.state.expanded} 
        onExpandChange={this.handleExpandChange}
      >
        <CardHeader
          title={'REPLY'}
          actAsExpander
          showExpandableButton
        >
        </CardHeader>

        <CardText expandable>
          <SuggestionField label={'To'} messageConversation={this.props.messageConversation} />
          <TextField
            key={this.props.messageConversation.id}
            id={this.props.messageConversation.id}
            rows={5}
            underlineShow={false}
            value={this.state.input}
            multiLine
            fullWidth
            onChange={this.texFieldUpdate}
          />
          <CardActions>
            <FlatButton label="Send" onClick={this.replyMessage} />
            <FlatButton label="Discard" />
          </CardActions>
        </CardText>

      </Card>
    )
  }
}

export default compose(
  connect(
    state => {
      return state
    },
    dispatch => ({
      replyMessage: (message, messageConversationId) => dispatch({ type: actions.REPLY_MESSAGE, payload: {message, messageConversationId} }),
    }),
  ),
  pure,
)(ReplyCard);