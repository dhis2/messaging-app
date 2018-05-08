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

class Message extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const message = this.props.message
    const messageConversation = this.props.messageConversation
    const messageType = this.props.messageConversation.messageType

    const fromTitle = message.sender ? message.sender.displayName : 'System notification'
    const today = moment()
    const messageDate = moment(message.created)

    return (
      <div style={{
        backgroundColor: theme.palette.canvasColor,
        padding: '16px 16px 16px 16px',
        gridArea: '1 / 1 / span 1 / span 2',
      }}
      >
        <div
          style={{
            margin: this.props.wideview ? '5px 10px' : '',
            paddingBottom: '0px',
            display: 'grid',
            gridTemplateColumns: '80% 20%',
          }}
        >
          <div style={{
            gridArea: '1 / 1',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
          }}>
            {fromTitle}
          </div>

          <CardText style={{
            gridArea: '2 / 1',
            padding: '16px 0px 16px 0px',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
          }}>
            {message.text}
          </CardText>

          <div
            content={messageDate.format('YYYY-MM-DD hh:mm')}
            placement={'bottom'}
            style={{
              gridArea: '1 / 2',
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '10px',
              marginTop: '10px',
            }}
          >
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }}>
              {today.year() == messageDate.year() ? messageDate.format('MMM DD') : messageDate.format('ll')}
            </div>
          </div>
        </div>
        {!this.props.lastMessage && <Divider /> }
      </div>
    )
  }
}

export default Message;