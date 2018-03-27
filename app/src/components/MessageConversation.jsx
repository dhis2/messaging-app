import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';

import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'

import { messageConversationContainer, messagePanelContainer, subheader } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
const moment = require('moment');

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

  render() {
    const messageConversation = this.props.messageConversation;

    const messages = this.props.disableLink ? messageConversation.messages : messageConversation.messages.slice(0, 1)
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
            const title = messageConversation.messageType == 'PRIVATE' ? message.sender.displayName : messageConversation.messageType;
            return (
              <div
                onClick={() => !this.props.disableLink && this.onClick(`/${messageConversation.messageType}/${messageConversation.id}`)}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                style={{
                  transition: 'all 0.2s ease-in-out',
                  cursor: this.props.disableLink ? 'auto' : this.state.cursor,
                  backgroundColor: this.getBackgroundColor(this.props.selectedValue, messageConversation.id),
                  margin: this.props.wideview ? '10px' : '',
                  borderLeftStyle: !messageConversation.read && !this.state.expanded ? 'solid' : '',
                  borderLeftWidth: '3px',
                  borderLeftColor: theme.palette.primary1Color,
                  borderBottom: '1px solid ' + theme.palette.accent3Color,
                  borderTop: '1px solid ' + theme.palette.accent3Color,
                  paddingBottom: '0px'
                }}
                key={message.id}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }} >
                  <div
                    style={{
                      padding: '16px 0px 16px 16px',
                      fontWeight: '500',
                      boxSizing: 'border-box',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      width: '200px'
                    }} >
                    <div> {title} </div>
                    <div> {moment(message.lastUpdated).format('ddd DD/MM/YYYY HH:mm')} </div>
                  </div>

                  {(this.state.cursor == 'pointer' && !this.props.disableLink) && <div >
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.deleteMessageConversations} icon={'delete'} tooltip={'Delete'} />
                    <CustomFontIcon size={5} child={this.props.messageConversation} onClick={this.props.markUnread} icon={'markunread'} tooltip={'Mark as unread'} />
                  </div>}
                </div>

                <CardText style={{
                  overflow: this.state.expanded ? 'auto' : 'hidden',
                  textOverflow: this.state.expanded ? 'initial' : 'ellipsis',
                  whiteSpace: this.state.expanded ? 'normal' : 'nowrap',
                }}>
                  {message.text}
                </CardText>
              </div>
            )
          })
          }
        </List>
        {((messageConversation.messageType == 'PRIVATE') && this.state.expanded) &&
          <ReplyCard messageConversation={messageConversation} />}
      </div>
    )
  }
}

export default MessageConversation