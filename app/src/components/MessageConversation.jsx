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

    this.state = {
      expanded: props.expanded != undefined ? props.expanded : true,
      cursor: 'auto',
    }
  }

  componentWillUnmount() {
    this.props.setSelectedMessageConversation( undefined )
  }

  updateMessageConversation = (updateMessageConversation, messageConversation, identifier, key) => {
    switch (identifier) {
      case 'STATUS':
        messageConversation.status = key;
        break;
      case 'PRIORITY':
        messageConversation.priority = key;
        break;
      case 'ASSIGNEE':
        messageConversation.assignee = key;
        break;
    }

    updateMessageConversation(messageConversation, identifier)
  }

  updateMessageConversationStatus = (child, identifier) => {
    this.props.updateMessageConversationStatus(child, identifier)
  }

  updateMessageConversationPriority = (child, identifier) => {
    this.props.updateMessageConversationPriority(child, identifier)
  }

  updateMessageConversationAssignee = (child, identifier) => {
    this.props.updateMessageConversationAssignee(child, identifier)
  }

  markUnread = (child) => {
    this.props.markMessageConversationsUnread([child.id], this.props.selectedMessageType)
  }

  setSelected = (child, selectedValue) => {
    this.props.setSelected(child, selectedValue)
  }

  deleteMessageConversations = (child) => {
    this.props.deleteMessageConversation(child.id, this.props.selectedMessageType)
  }

  render() {
    let messageConversation = this.props.messageConversation;

    const messages = this.props.disableLink ? messageConversation.messages : messageConversation.messages.slice(0, 1);
    const displayExtendedInfo = (messageConversation.messageType == 'TICKET' || messageConversation.messageType == '') && this.props.wideview;
    const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType) + 1);
    const assigneValue = messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None';
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
          <div
            style={{
              gridArea: '1 / 2',
              display: 'flex',
              justifyContent: 'flex-end',
              alignSelf: 'center',
            }}
          >
            <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
          </div>
        </div>
        <Paper
          style={{
            marginBottom: '50px',
            display: 'grid',
            gridTemplateColumns: '90% 10%',
            gridTemplateRows: '90% 10%',
          }}
        >
          {/*!this.props.disableLink && <Checkbox
            style={{
              gridArea: '1 / 1 / span 1 / span 1',
              marginLeft: '5px',
              display: 'flex',
              alignSelf: 'center',
            }}
            onCheck={() => this.setSelected(messageConversation, !messageConversation.selectedValue)}
          />
          
           {true &&
            <CustomDropDown
              gridColumn={4}
              subheader={'Status'}
              onChange={(event, key, value) => this.updateMessageConversation(this.updateMessageConversationStatus, messageConversation, 'STATUS', value)}
              value={messageConversation.status}
              children={
                [
                  <MenuItem key={'OPEN'} value={'OPEN'} primaryText="Open" />,
                  <MenuItem key={'PENDING'} value={'PENDING'} primaryText="Pending" />,
                  <MenuItem key={'INVALID'} value={'INVALID'} primaryText="Invalid" />,
                  <MenuItem key={'SOLVED'} value={'SOLVED'} primaryText="Solved" />
                ]
              }
            />
          }

          {true &&
            <CustomDropDown
              gridColumn={5}
              subheader={'Status'}
              onChange={(event, key, value) => this.updateMessageConversation(this.updateMessageConversationPriority, messageConversation, 'PRIORITY', value)}
              value={messageConversation.priority}
              children={
                [
                  <MenuItem key={'LOW'} value={'LOW'} primaryText="Low" />,
                  <MenuItem key={'MEDIUM'} value={'MEDIUM'} primaryText="Medium" />,
                  <MenuItem key={'HIGH'} value={'HIGH'} primaryText="High" />
                ]
              }
            />
          }
           {false &&
          <CustomDropDown
            gridColumn={3}
            subheader={'Assignee'}
            value={assigneValue}
            children={
              [
                <MenuItem key={assigneValue} value={assigneValue} primaryText={assigneValue} />,
                <SuggestionField
                  updateMessageConversation={(chip) => this.updateMessageConversation(this.updateMessageConversationAssignee, messageConversation, 'ASSIGNEE', chip)}
                  key={'suggestionField'}
                  label={'Assignee'}
                />
              ]
            }
          />
        }

          <div
            //onClick={() => !this.props.disableLink && this.onClick(messageConversation)}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={{
              //cursor: this.props.disableLink ? 'auto' : this.state.cursor,
              gridArea: !this.props.disableLink ? '1 / 2 / span 1 / span 2' : '1 / 1 / span 1 / span 5',
              display: 'grid',
              gridTemplateColumns: '20% 80%',
              padding: '16px 0px 16px 16px',
              boxSizing: 'border-box',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
          >

          
          */}

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

export default compose(
  connect(
    state => {
      return {
        selectedMessageType: state.messaging.selectedMessageType
      }
    }
    ,
    dispatch => ({
      updateMessageConversationStatus: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_STATUS, payload: { messageConversation, identifier } }),
      updateMessageConversationPriority: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_PRIORITY, payload: { messageConversation, identifier } }),
      updateMessageConversationAssignee: (messageConversation, identifier) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATION_ASSIGNEE, payload: { messageConversation, identifier } }),
      setSelected: (messageConversation, selectedValue) => dispatch({ type: actions.SET_SELECTED_VALUE, payload: { messageConversation, selectedValue } }),
      setSelectedMessageConversation: (messageConversation) => dispatch({ type: actions.SET_SELECTED_MESSAGE_CONVERSATION, payload: { messageConversation } }),
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
      deleteMessageConversation: (messageConversationId, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATION, payload: { messageConversationId, messageType } }),
    }),
  ),
  pure,
)(MessageConversation);