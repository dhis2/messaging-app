import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Message from './Message'
import ReplyCard from './ReplyCard'
import CustomFontIcon from './CustomFontIcon'
import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker'

import { messageConversationContainer, messagePanelContainer, subheader_minilist } from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';
import { fontFamily } from '../constants/development';

const moment = require('moment');
const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT']

class MessageConversationListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: theme.palette.canvasColor,
      cursor: 'auto',
    }
  }

  getBackgroundColor = (messageConversation, checked) => {
    const selectedMessageConversation = this.props.selectedMessageConversation && messageConversation.id == this.props.selectedMessageConversation.id;

    if (checked && !selectedMessageConversation) {
      return theme.palette.blue50
    } else if (selectedMessageConversation) {
      return theme.palette.accent3Color
    } else {
      return this.state.backgroundColor
    }
  };

  onClick = (messageConversation) => {
    this.props.setSelectedMessageConversation(messageConversation)
    if (messageConversation && !messageConversation.read) {
      this.props.markMessageConversationsRead([messageConversation.id], this.props.selectedMessageType)
    }
    history.push(`/${messageConversation.messageType}/${messageConversation.id}`)
  }

  onMouseEnter = () => { this.setState({ cursor: 'pointer' }) }
  onMouseLeave = () => { this.setState({ cursor: 'auto' }) }

  render() {
    const messageConversation = this.props.messageConversation;
    const message = messageConversation.messages[messageConversation.messages.length - 1];
    const title = message.sender ? message.sender.displayName : this.props.selectedMessageType.displayName;
    const checked = _.find(this.props.checkedIds, { 'id': messageConversation.id }) != undefined;

    const displayExtendedChoices = this.props.displayExtendedChoices;
    
    const today = moment()
    const messageDate = moment(message.created)

    return (
      <Paper style={{
        backgroundColor: this.getBackgroundColor(messageConversation, checked),
        display: 'grid',
        gridTemplateColumns: this.props.wideview ? '65% 10% 10% 10% 5%' : '50% 0% 0% 20% 30%',
        gridTemplateRows: '15% 85%',
        transition: 'all 0.2s ease-in-out',
        margin: this.props.wideview ? '10px 10px 10px 10px' : '',
        borderLeftStyle: !messageConversation.read && !this.state.expanded ? 'solid' : '',
        borderLeftWidth: '3px',
        borderLeftColor: theme.palette.primary1Color,
        cursor: this.state.cursor,
        boxSizing: 'border-box',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
        onClick={(event) => {
          const onClick = event.target.innerText != undefined && event.target.innerText != ''
          onClick && this.onClick(messageConversation)
          onClick && this.props.clearCheckedIds()
          onClick && this.props.wideview && this.props.setMessageFilter('')
          onClick && this.props.clearRecipientSearch( )
        }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div style={{
          ...subheader_minilist,
          color: 'black',
        }}>
          {title}
        </div>
        <Checkbox
          checked={checked}
          style={{
            gridArea: '1 / 1',
            display: 'flex',
            alignSelf: 'center',
            paddingLeft: '10px',
            width: '50px'
          }}
          onCheck={(event, isInputChecked) => {
            this.props.setSelected(messageConversation, !messageConversation.selectedValue)
          }}
        />

        <CardText style={{
          gridArea: displayExtendedChoices ? '2 / 1 / span 1 / span 1' : '2 / 1 / span 1 / span 4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '10px',
          fontFamily: fontFamily,
        }}>
          {message.text}
        </CardText>

        {displayExtendedChoices && <ExtendedChoiceLabel gridArea={'1/2'} title={'Status'} label={messageConversation.status} />}
        {displayExtendedChoices && <ExtendedChoiceLabel gridArea={'1/3'} title={'Priority'} label={messageConversation.priority} />}
        {displayExtendedChoices && <ExtendedChoiceLabel gridArea={'1/4'} title={'Assignee'} label={messageConversation.assignee ? messageConversation.assignee.displayName : undefined} />}
        <Subheader style={{
          display: 'flex',
          gridArea: '1 / 5',
          justifyContent: 'flex-end',
          paddingRight: '10px',
          fontFamily: fontFamily,
        }}>
          {today.year() == messageDate.year() ? messageDate.format('MMM DD') : messageDate.format('ll')}
        </Subheader>
      </Paper>
    )
  }
}

const ExtendedChoiceLabel = ({ gridArea, title, label }) => {
  return (
    <div style={{ gridArea: gridArea }}>
      <Subheader style={{ height: '32px' }}> {title} </Subheader>
      <Subheader style={{ color: 'black', height: '32px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} > {label ? label : 'None'} </Subheader>
    </div>
  )
}

export default compose(
  connect(
    state => {
      return {
        selectedMessageConversation: state.messaging.selectedMessageConversation,
        selectedMessageType: state.messaging.selectedMessageType,
        checkedIds: state.messaging.checkedIds,
        numberOfCheckedIds: state.messaging.checkedIds.length,
      }
    }
    ,
    dispatch => ({
      setSelected: (messageConversation, selectedValue) => dispatch({ type: actions.SET_SELECTED_VALUE, payload: { messageConversation, selectedValue } }),
      setSelectedMessageConversation: (messageConversation) => dispatch({ type: actions.SET_SELECTED_MESSAGE_CONVERSATION, payload: { messageConversation } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
      clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
      clearRecipientSearch: () => dispatch({ type: actions.RECIPIENT_SEARCH_SUCCESS, payload: { suggestions: [] } }),
      setMessageFilter: messageFilter => dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
    }),
  ),
)(MessageConversationListItem);