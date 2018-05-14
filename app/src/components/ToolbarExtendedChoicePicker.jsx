import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import CustomFontIcon from './CustomFontIcon';
import AssignToDialog from './AssignToDialog';

import * as actions from 'constants/actions';
import extendedChoices from 'constants/extendedChoices';
import MessageConversation from './MessageConversation';

class ExtendedChoicePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      checkedItems: false,
      dialogOpen: false,
      assignToOpen: false,
    };
  }

  getIds() {
    return this.props.messageConversation ? [this.props.messageConversation.id] : this.props.checkedIds.map(id => id.id);
  }

  updateMessageConversation = (identifier, value) => {
    const ids = this.getIds()
    this.props.updateMessageConversations(ids, identifier, value, this.props.selectedMessageType)
    this.props.checkedIds.length > 0 && this.props.clearCheckedIds()
  }

  markMessageConversations(mode) {
    const ids = this.getIds()
    if (mode == 'unread') {
      this.props.markMessageConversationsUnread(ids, this.props.selectedMessageType)
    } else if (mode == 'read') {
      this.props.markMessageConversationsRead(ids, this.props.selectedMessageType)
    }
    this.props.checkedIds.length > 0 && this.props.clearCheckedIds()
  }

  toogleDialog() {
    this.setState({ dialogOpen: !this.state.dialogOpen });
  };

  render() {
    const messageConversation = this.props.messageConversation;
    const multiSelect = !messageConversation;
    const assigneValue = multiSelect ? '' : messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None';

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.toogleDialog()}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.props.deleteMessageConversations(this.getIds(), this.props.selectedMessageType)
          this.toogleDialog()
          this.props.clearCheckedIds()
        }}
      />,
    ];

    return (
      <div
        style={{
          gridArea: this.props.gridArea,
          display: 'flex',
          justifyContent: this.props.justifyContent,
          width: '100%',
          marginRight: '10px'
        }}>
        <Dialog
          title="Are you sure you want to delete selected message conversation(s)?"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.toogleDialog}
        />
        <AssignToDialog open={this.state.assignToOpen} onRequestClose={() => this.setState({ assignToOpen: !this.state.assignToOpen})} updateMessageConversations={(id) => this.updateMessageConversation('ASSIGNEE', id)}/>

        {!this.props.messageConversation && <Subheader style={{ padding: '0px 0px' }} > {this.props.numberOfCheckedIds} selected </Subheader>}
        <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.toogleDialog()} icon={'delete'} tooltip={'Delete selected'} />
        <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.markMessageConversations('unread')} icon={'markunread'} tooltip={'Mark selected as unread'} />
        <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.markMessageConversations('read')} icon={'done'} tooltip={'Mark selected as read'} />
        {this.props.displayExtendedChoices && <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Subheader style={{ padding: '0px 16px' }} > Set status </Subheader>
          {
            extendedChoices.STATUS.map( elem => 
              <MenuItem key={elem.key} value={elem.value} primaryText={elem.primaryText} onClick={() => this.updateMessageConversation('STATUS', elem.key)}/>
            )
          }
          <Divider />
          <Subheader style={{ padding: '0px 16px' }} > Set priority </Subheader>
          {
            extendedChoices.PRIORITY.map( elem => 
              <MenuItem key={elem.key} value={elem.value} primaryText={elem.primaryText} onClick={() => this.updateMessageConversation('PRIORITY', elem.key)}/>
            )
          }
          <Divider />
          <MenuItem key={'assignTo'} value={'assignTo'} primaryText={'Assign to'} onClick={() => this.setState({ assignToOpen: !this.state.assignToOpen })} />
        </IconMenu>}
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        selectedMessageType: state.messaging.selectedMessageType,
        checkedIds: state.messaging.checkedIds,
        numberOfCheckedIds: state.messaging.checkedIds.length,
      }
    }
    ,
    dispatch => ({
      clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
      deleteMessageConversations: (messageConversationIds, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATIONS, payload: { messageConversationIds, messageType } }),
      updateMessageConversations: (messageConversationIds, identifier, value, messageType) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATIONS, payload: { messageConversationIds, identifier, value, messageType } }),
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
    }),
  ),
)(ExtendedChoicePicker);