import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';

import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'
import CustomDropDown from './CustomDropDown'
import SuggestionField from './SuggestionField'

import { messageConversationContainer, messagePanelContainer, subheader } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';

const moment = require('moment');

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: theme.palette.canvasColor,
      expanded: props.expanded != undefined ? props.expanded : true,
      cursor: 'auto',
    }
  }

  setBackgroundColor = color => {
    this.setState({
      backgroundColor: color,
    });
  };

  getBackgroundColor = (selectedValue, id) => id == selectedValue ? theme.palette.accent3Color : this.state.backgroundColor;

  onClick = (messageConversation) => {
    this.props.setSelectedMessageConversation( messageConversation )
    if (messageConversation && !messageConversation.read) {
      this.props.markMessageConversationsRead([messageConversation.id], this.props.selectedMessageType)
    }
    history.push(`/${messageConversation.messageType}/${messageConversation.id}`)
  }

  onMouseEnter = () => { this.setState({ cursor: 'pointer' }) }
  onMouseLeave = () => { this.setState({ cursor: 'auto' }) }

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
    const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType) + 1);
    const displayExtendedInfo = (messageConversation.messageType == 'TICKET' || messageConversation.messageType == '') && this.props.wideview;
    const assigneValue = messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None';

    return (
      <div style={{
        marginBottom: this.props.disableLink && '50px',
      }}>
        {this.props.disableLink && <Subheader style={subheader}> {messageConversation.subject} </Subheader>}
        <List style={{
          padding: '0px'
        }}
        >
          {messages.map(message => {
            const title = !notification ? message.sender.displayName : this.props.selectedMessageType.displayName
            return (
              <div key={message.id}>
                <div
                  style={{
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: this.getBackgroundColor(this.props.selectedValue, messageConversation.id),
                    margin: this.props.wideview ? '5px 10px' : '',
                    borderLeftStyle: !messageConversation.read && !this.state.expanded ? 'solid' : '',
                    borderLeftWidth: '3px',
                    borderLeftColor: theme.palette.primary1Color,
                    paddingBottom: '0px',
                    display: 'grid',
                    gridTemplateColumns: this.props.wideview ? '3% 48% 13% 13% 13% 10%' : '10% 50% 10% 10% 10% 10%',
                  }}
                >
                  {!this.props.disableLink && <Checkbox
                    style={{
                      gridArea: '1 / 1 / span 1 / span 1',
                      marginLeft: '5px',
                      display: 'flex',
                      alignSelf: 'center',
                    }}
                    onCheck={() => this.setSelected(messageConversation, !messageConversation.selectedValue)}
                  />}
                  <div
                    onClick={() => !this.props.disableLink && this.onClick(messageConversation)}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    style={{
                      cursor: this.props.disableLink ? 'auto' : this.state.cursor,
                      gridArea: !this.props.disableLink ? '1 / 2 / span 1 / span 2' : '1 / 1 / span 1 / span 2' ,
                      display: 'grid',
                      gridTemplateColumns: '20% 80%',
                      padding: '16px 0px 16px 16px',
                      fontWeight: '500',
                      boxSizing: 'border-box',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{
                      gridColumn: '1',
                    }}>
                      {title}
                    </div>
                    {this.props.wideview && <div style={{
                      gridColumn: '2',
                    }}>
                      {moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')}
                    </div>}

                    <CardText style={{
                      gridArea: '2 / 1 / span 1 / span 2',
                      width: this.props.wideview ? '70%' : '100%',
                      overflow: this.state.expanded ? 'auto' : 'hidden',
                      textOverflow: this.state.expanded ? 'initial' : 'ellipsis',
                      whiteSpace: this.state.expanded ? 'normal' : 'nowrap',
                      padding: '16px 0px 0px 0px'
                    }}>
                      {message.text}
                    </CardText>
                  </div>

                  {displayExtendedInfo &&
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

                  {displayExtendedInfo &&
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

                  {displayExtendedInfo &&
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

                  {!this.props.disableLink && <div
                    style={{
                      gridArea: '1 / 6',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.markUnread} icon={'markunread'} tooltip={'Mark as unread'} />
                  </div>}
                </div>
                {(this.props.disableLink || !this.props.wideview) && <Divider />}
              </div>
            )
          })
          }
        </List>
        {(!notification && this.state.expanded) &&
          <ReplyCard messageConversation={messageConversation} />}
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
      setSelected: (messageConversation, selectedValue) => dispatch({ type: actions.SET_SELECTED_VALUE, payload: {messageConversation, selectedValue} }),
      setSelectedMessageConversation: (messageConversation) => dispatch({ type: actions.SET_SELECTED_MESSAGE_CONVERSATION, payload: { messageConversation } }),
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
      deleteMessageConversation: (messageConversationId, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATION, payload: { messageConversationId, messageType } }),
    }),
  ),
  pure,
)(MessageConversation);