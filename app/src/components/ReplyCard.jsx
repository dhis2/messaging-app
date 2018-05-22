import React, { Component } from 'react';
import ReactDOM from 'react-dom'
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
import history from 'utils/history';

class ReplyCard extends Component {
  constructor(props){
    super(props) 

    this.state = {
      input: '',
      expanded: false,
      recipients: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.messageConversation.id != nextProps.messageConversation.id ) {
      this.setState({ expanded: false })
    }
  }

  animateScroll = (duration) => {
    const messagepanel = document.getElementById('messageconversation');

    var start = messagepanel.scrollTop;
    var end = messagepanel.scrollHeight;
    var change = end - start;
    var increment = 5;

    function easeInOut(currentTime, start, change, duration) {
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    function animate(elapsedTime) {
      elapsedTime += increment;
      var position = easeInOut(elapsedTime, start, change, duration);
      messagepanel.scrollTop = position;
      if (elapsedTime < duration) {
        setTimeout(function() {
          animate(elapsedTime);
        }, increment)
      }
    }
    animate(0);
  }

  handleExpandChange = (expanded) => {
    this.animateScroll(500);

    this.setState({expanded: expanded});
  };

  texFieldUpdate = (event, newValue) => {
    this.setState({input: newValue})
  }

  updateRecipients = (recipients) => {
    this.setState({
      recipients: recipients
    })
  }

  replyMessage = () => {
    const messageType = _.find(this.props.messageTypes, { id: 'PRIVATE' });
    const users = this.state.recipients.filter(r => r.type == 'user');
    const userGroups = this.state.recipients.filter(r => r.type == 'userGroup')
    const organisationUnits = this.state.recipients.filter(r => r.type == 'organisationUnit')
    this.props.replyMessage(this.state.input, users, userGroups, organisationUnits, this.props.messageConversation, messageType)
    this.wipeInput()
  }

  wipeInput = () => {
    this.setState({input: '', expanded: false})
  }

  render() {
    return (
      <Card
        style={{
          marginTop: '5px',
          gridArea: this.props.gridArea,
        }}
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
          <SuggestionField label={'Add recipients to conversation'} messageConversation={this.props.messageConversation} recipients={this.state.recipients} updateRecipients={this.updateRecipients} />
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
            <FlatButton label="Discard" onClick={ () => {
              this.props.setSelectedMessageType( this.props.messageConversation.messageType) 
              history.push( '/' + this.props.messageConversation.messageType)    
            }} />
          </CardActions>
        </CardText>
      </Card>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        messageTypes: state.messaging.messageTypes
      }
    },
    dispatch => ({
      replyMessage: (message, users, userGroups, organisationUnits, messageConversation, messageType) => dispatch({ type: actions.REPLY_MESSAGE, payload: {message, users, userGroups, organisationUnits, messageConversation, messageType} }),
      setSelectedMessageType: (messageTypeId) => dispatch({ type: actions.SET_SELECTED_MESSAGE_TYPE, payload: { messageTypeId } }),
    }),
  ),
  pure,
)(ReplyCard);