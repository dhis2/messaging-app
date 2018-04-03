import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';

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
      case 'ASSIGNEE':
        messageConversation.assignee = key;
        break;
    }

    updateMessageConversation(messageConversation, identifier)
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
            const title = !notification ? message.sender.displayName : messageConversation.messageType;
            return (
              <div>
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
                    gridTemplateColumns: '60% 10% 10% 10% 10%',
                  }}
                  key={message.id}
                >
                  <div
                    onClick={() => !this.props.disableLink && this.onClick(`/${messageConversation.messageType}/${messageConversation.id}`)}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    style={{
                      cursor: this.props.disableLink ? 'auto' : this.state.cursor,
                      gridArea: '1 / 1 / span 1 / span 2',
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
                      gridColumn={2}
                      subheader={'Assignee'}
                      value={assigneValue}
                      children={
                        [
                          <MenuItem key={assigneValue} value={assigneValue} primaryText={assigneValue} />,
                          <SuggestionField
                            updateMessageConversation={(chip) => this.updateMessageConversation(this.props.updateMessageConversationAssignee, messageConversation, 'ASSIGNEE', chip)}
                            key={'suggestionField'}
                            label={'Assignee'}
                          />
                        ]
                      }
                    />
                  }

                  {displayExtendedInfo &&
                    <CustomDropDown
                      gridColumn={3}
                      subheader={'Status'}
                      onChange={(event, key, value) => this.updateMessageConversation(this.props.updateMessageConversationStatus, messageConversation, 'STATUS', value)}
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
                      gridColumn={4}
                      subheader={'Status'}
                      onChange={(event, key, value) => this.updateMessageConversation(this.props.updateMessageConversationPriority, messageConversation, 'PRIORITY', value)}
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
                      gridColumn: 5,
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.markUnread} icon={'markunread'} tooltip={'Mark as unread'} />
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

export default MessageConversation