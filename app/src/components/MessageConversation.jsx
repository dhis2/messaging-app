import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';

import Message from './Message'
import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'
import CustomDropDown from './CustomDropDown'
import SuggestionField from './SuggestionField'

import { messageConversationContainer, messagePanelContainer, subheader } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversation extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let messageConversation = this.props.messageConversation;

    const messages = messageConversation.messages;
    const displayExtendedInfo = (messageConversation.messageType == 'TICKET' || messageConversation.messageType == '') && this.props.wideview;
    const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType) + 1);
    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 3 / span 1 / span 1';

    return (
      <div
        id='messageconversation'
        style={{
          gridArea: gridArea,
          margin: '0px 10px 10px 10px',
          backgroundColor: theme.palette.accent2Color,
          overflowY: 'scroll',
          overflowX: 'hidden',
          height: 'calc(100vh - 100px)',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80% 20%'
        }}>
          <Subheader style={{
            ...subheader,
            gridArea: '1 / 1',
            display: 'flex',
            alignSelf: 'center',
          }}>
            {messageConversation.subject}
          </Subheader>
        </div>
        <Paper
          style={{
            marginBottom: '50px',
            display: 'grid',
            gridTemplateColumns: '90% 10%',
            gridTemplateRows: '90% 10%',
          }}
        >
          <Paper style={{
            gridArea: '1 / 1 / span 1 / span 2',
            padding: '0px',
          }}
          >
            {messages.map((message, i) => <Message key={message.id} message={message} messageConversation={messageConversation} notification={notification} lastMessage={i + 1 === messages.length} />)}
          </Paper>
          {!notification &&
            <ReplyCard
              messageConversation={messageConversation}
              gridArea={'2 / 1 / span 1 / span 2'}
            />}
        </Paper>
      </div>
    )
  }
}

export default MessageConversation;