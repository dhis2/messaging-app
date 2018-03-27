import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import ReplyCard from './ReplyCard'
import SuggestionField from './SuggestionField'
import CustomFontIcon from './CustomFontIcon'

import { messageConversationContainer, messagePanelContainer, subheader } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
const moment = require('moment');

const NOTIFICATIONS = [ 'SYSTEM', 'VALIDATION_RESULT' ]

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

  onClick = (location) => {
    history.push(location)
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
    }

    updateMessageConversation( messageConversation )
  }

  render() {
    let messageConversation = this.props.messageConversation;

    const messages = this.props.disableLink ? messageConversation.messages : messageConversation.messages.slice(0, 1)
    const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType)+1)
    const displayTicketInfo = messageConversation.messageType == 'TICKET' && this.props.wideview
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
            const title = !notification ? message.sender.displayName : messageConversation.messageType;
            return (
              <div
                style={{
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: this.getBackgroundColor(this.props.selectedValue, messageConversation.id),
                  margin: this.props.wideview ? '10px' : '',
                  borderLeftStyle: !messageConversation.read && !this.state.expanded ? 'solid' : '',
                  borderLeftWidth: '3px',
                  borderLeftColor: theme.palette.primary1Color,
                  borderBottom: '1px solid ' + theme.palette.accent3Color,
                  borderTop: '1px solid ' + theme.palette.accent3Color,
                  paddingBottom: '0px',
                  display: 'grid',
                  gridTemplateColumns: '70% 10% 10% 10%',
                }}
                key={message.id}
              >
                <div
                  onClick={() => !this.props.disableLink && this.onClick(`/${messageConversation.messageType}/${messageConversation.id}`)}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  style={{
                    cursor: this.props.disableLink ? 'auto' : this.state.cursor,
                  }}
                >
                  <div style={{
                    gridColumn: 1,
                    padding: '16px 0px 16px 16px',
                    fontWeight: '500',
                    boxSizing: 'border-box',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                  }} >
                    <div> {title} </div>
                    <div> {moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')} </div>
                  </div>

                  <CardText style={{
                    gridColumn: 1,
                    width: this.props.wideview ? '70%' : '100%',
                    overflow: this.state.expanded ? 'auto' : 'hidden',
                    textOverflow: this.state.expanded ? 'initial' : 'ellipsis',
                    whiteSpace: this.state.expanded ? 'normal' : 'nowrap',
                  }}>
                    {message.text}
                  </CardText>
                </div>

                {displayTicketInfo &&
                  <DropDownMenu style={{
                    gridColumn: 2,
                    width: '200px',
                  }}>
                    <SuggestionField label={messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None'} />
                  </DropDownMenu>}

                {displayTicketInfo &&
                  <div style={{
                    gridColumn: 3,
                  }} >
                    <DropDownMenu
                      style={{
                        width: '150px',
                      }}
                      onChange={(event, key, value) => this.updateMessageConversation(this.props.updateMessageConversationStatus, messageConversation, 'STATUS', value)}
                      value={messageConversation.status} >
                      <MenuItem value={'OPEN'} primaryText="Open" />
                      <MenuItem value={'PENDING'} primaryText="Pending" />
                      <MenuItem value={'INVALID'} primaryText="Invalid" />
                      <MenuItem value={'SOLVED'} primaryText="Solved" />
                    </DropDownMenu>

                    <DropDownMenu
                      style={{
                        width: '150px'
                      }}
                      onChange={(event, key, value) => this.updateMessageConversation(this.props.updateMessageConversationPriority, messageConversation, 'PRIORITY', value)}
                      value={messageConversation.priority} >
                      <MenuItem value={'LOW'} primaryText="Low" />
                      <MenuItem value={'MEDIUM'} primaryText="Medium" />
                      <MenuItem value={'HIGH'} primaryText="High" />
                    </DropDownMenu>
                  </div>
                }

                {!this.props.disableLink && <div
                  style={{
                    gridColumn: 4,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
                  <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.markUnread} icon={'markunread'} tooltip={'Mark as unread'} />
                </div>}
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

export default MessageConversation