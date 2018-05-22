import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { getInstance as getD2Instance } from 'd2/lib/d2';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import ExpandMore from 'material-ui-icons/ExpandMore';

import Message from './Message'
import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'
import CustomDropDown from './CustomDropDown'
import SuggestionField from './SuggestionField'
import ExtendedInformation from './ExtendedInformation'

import { messageConversationContainer, messagePanelContainer, subheader, subheader_minilist } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';
import * as api from 'api/api';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      participants: [],
      participantsExpanded: false,
      currentUser: undefined,
    }
  }

  fetchParticipants(messageConversation) {
    api.fetchParticipants(messageConversation.id)
      .then(({ userMessages }) => {
        getD2Instance().then(instance => {
          this.setState({
            participants: userMessages,
            currentUser: instance.currentUser,
          })
        })
      })
  }

  componentWillMount() {
    if (this.props.messageConversation) {
      this.fetchParticipants(this.props.messageConversation)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messageConversation.id != nextProps.messageConversation.id && nextProps.messageConversation != undefined) {
      this.fetchParticipants(nextProps.messageConversation)
      this.setState({
        participantsExpanded: false,
      })
    }
  }

  render() {
    const messageConversation = this.props.messageConversation;

    const messages = messageConversation.messages;
    const displayExtendedInfo = (messageConversation.messageType == 'TICKET' || messageConversation.messageType == '') && this.props.wideview;
    const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType) + 1);
    const gridArea = this.props.wideview ? '2 / 2 / span 1 / span 2' : '2 / 3 / span 1 / span 1';

    const participants = this.state.participants.map(userMessage => (this.state.participantsExpanded || this.state.currentUser.id != userMessage.user.id) ? userMessage.user.displayName : 'me').join(', ');

    return (
      <div
        id='messageconversation'
        style={{
          gridArea: gridArea,
          overflowY: 'scroll',
          overflowX: 'hidden',
          height: 'calc(100vh - 110px)',
          paddingTop: '10px',
        }}
      >
        <div style={{
          display: 'grid',
          margin: '0px 10px 0px 10px',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gridTemplateRows: '50% 50%'
        }}>
          <Subheader style={{
            ...subheader,
            paddingLeft: '0px',
            display: 'flex',
            alignSelf: 'center',
            gridArea: '1 / 1 / span 1 / span 7'
          }}>
            {messageConversation.subject}
          </Subheader>
          <Subheader style={{
            fontSize: '14px',
            paddingLeft: '0px',
            gridArea: '2 / 1 / span 1 / span 6',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: this.state.participantsExpanded ? '' : 'nowrap',
          }}>
            {'Participants: ' + participants}
          </Subheader>
          <IconButton
            style={{
              marginTop: '0px',
              padding: '0px',
              gridArea: '2 / 7'
            }}
            tooltip={'Display all participants'}
            tooltipPosition="bottom-left"
          >
            <ExpandMore onClick={() => this.setState({ participantsExpanded: !this.state.participantsExpanded })}/>
          </IconButton>
          {this.props.displayExtendedChoices && <ExtendedInformation messageConversation={messageConversation} gridArea={'1 / 8 / span 2 / span 3'} />}
        </div>
        <div
          style={{
            marginBottom: '50px',
            display: 'grid',
            backgroundColor: theme.palette.accent2Color,
            gridTemplateColumns: '90% 10%',
            gridTemplateRows: '90% 10%',
            margin: '0px 10px 10px 10px',
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
        </div>
      </div>
    )
  }
}

export default MessageConversation;