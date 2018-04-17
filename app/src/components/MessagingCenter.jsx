import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import CreateMessageIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ViewList from 'material-ui-icons/ViewList';
import Subheader from 'material-ui/Subheader/Subheader';
import { ToolbarSeparator } from 'material-ui/Toolbar';
import MailIcon from 'material-ui-icons/MailOutline';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid, subheader } from '../styles/style';

import SidebarList from './SidebarList';
import MessageConversation from './MessageConversation';
import MessageConversationList from './MessageConversationList';
import CreateMessage from './CreateMessage';
import CustomFontIcon from './CustomFontIcon';

import history from 'utils/history';

const headerHight = '48px'

class MessagingCenter extends Component {
  state = {}

  constructor(props) {
    super(props)

    this.state = {
      drawerOpen: true,
      wideview: false,
      checkedItems: false,
      dialogOpen: false,
    };
  }

  componentWillMount() {
    const selectedMessageType = this.props.match.params.messageType
    const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

    this.props.messageTypes.map(messageType => {
      this.props.loadMessageConversations(messageType, selectedMessageType, selectedId);
    })
  }

  loadMoreMessageConversations(messageType) {
    let messageTypeState = _.find(this.props.messageTypes, { id: messageType });
    this.props.loadMessageConversations(messageTypeState.id, messageTypeState.page + 1);
  }

  markMessageConversations( mode ) {
    const ids = [] 
    this.props.checkedIds.forEach( id => ids.push( id.id ))
    if (mode == 'unread') {
      this.props.markMessageConversationsUnread(ids, this.props.selectedMessageType)
    } else if (mode == 'read') {
      this.props.markMessageConversationsRead(ids, this.props.selectedMessageType)
    }
    this.props.clearCheckedIds()
  }

  toogleDrawer() {
    this.setState({ drawerOpen: !this.state.drawerOpen })
  }

  toogleWideview() {
    this.setState({ wideview: !this.state.wideview })
  }

  toogleDialog() {
    this.setState({ dialogOpen: !this.state.dialogOpen} );
  };

  render() {
    const messageType = this.props.match.params.messageType;
    const id = this.props.location.pathname.split('/').slice(-1)[0];
    const checkedOptions = this.props.checkedOptions;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.toogleDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.toogleDialog()
          this.props.deleteMessageConversations(this.props.checkedIds, this.props.selectedMessageType)
        }}
      />,
    ];

    return (
      <div style={grid} >
        <Dialog
          title="Are you sure you want to delete selected message conversations?"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.toogleDialog}
        />
        <Paper style={{
          gridArea: '1 / 1 / span 1 / span 3',
          display: 'grid',
          gridTemplateColumns: 'minmax(150px, 15%) 20% 65%',
          backgroundColor: checkedOptions ? theme.palette.accent3Color : theme.palette.accent2Color,
          zIndex: 10,
        }}>
          <FlatButton
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              gridArea: '1 / 1',
              width: '150px'
            }}
            icon={ !checkedOptions ? <CreateMessageIcon /> : <NavigationBack />}
            onClick={() => checkedOptions ? this.props.clearCheckedIds() : history.push( '/' + messageType + '/create' )}
            label={checkedOptions ? "Back" : "Compose" }
          />
          {!checkedOptions && <TextField
            style={{
              gridArea: '1 / 2',
              height: headerHight,
            }}
            fullWidth
            hintText={'Search'}
            onChange={(event, messageFilter) => this.props.setMessageFilter(messageFilter)}
            type="search"
            margin="normal"
          />}

          <div
            style={{
              gridArea: '1 / 3',
              display: 'grid',
              gridTemplateColumns: '90% 10%'
            }}>
            {checkedOptions &&
              <div
                className={'messageConversationOptions'}
                style={{
                  gridArea: '1 / 1',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignSelf: 'center',
                }}>
                <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.toogleDialog()} icon={'delete'} tooltip={'Delete selected'} />
                <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.markMessageConversations('unread')} icon={'markunread'} tooltip={'Mark selected as unread'} />
                <CustomFontIcon size={5} child={this.props.messageConversation} onClick={(child) => this.markMessageConversations('read')} icon={'done'} tooltip={'Mark selected as read'} />
              </div>}
            <div style={{
              gridArea: '1 / 2',
              display: 'flex',
              justifyContent: 'flex-end',
              alignSelf: 'center',
            }}>
              <FlatButton
                style={{ textAlign: 'right', marginRight: '5px' }}
                icon={<ViewList style={{ marginRight: '5px' }} />}
                onClick={() => this.toogleWideview()}
              />
            </div>
          </div>
        </Paper>

        <SidebarList {...this.props} drawerOpen={this.state.drawerOpen} gridColumn={1} children={this.props.messageTypes} />

        {id == 'create' &&
          <CreateMessage wideview={this.state.wideview} />}

        <MessageConversationList wideview={this.state.wideview} />

        {(this.props.selectedMessageConversation && id != 'create') ?
          <MessageConversation
            messageConversation={this.props.selectedMessageConversation}
            wideview={this.state.wideview}
            disableLink={true}
          />
          :
          !this.state.wideview &&
          <div style={{
            textAlign: 'center',
            paddingTop: '100px'
          }}>
            <Subheader style={subheader}>{'Select a message'}</Subheader>
            <MailIcon style={{
              color: theme.palette.primary1Color,
              width: 120,
              height: 120,
            }} />
          </div>}
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      const checkedOptions = state.messaging.checkedIds.length > 0;
      return {
        messageTypes: state.messaging.messageTypes,
        messageConversations: state.messaging.messageConversations,
        selectedMessageType: state.messaging.selectedMessageType,
        selectedMessageConversation: state.messaging.selectedMessageConversation,
        checkedIds: state.messaging.checkedIds,
        checkedOptions: checkedOptions,
        loaded: state.messaging.loaded,
      }
    },
    dispatch => ({
      loadMessageConversations: (messageType, selectedMessageType, selectedId) => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: { messageType, selectedMessageType, selectedId } }),
      markMessageConversationsUnread: (markedUnreadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations, messageType } }),
      markMessageConversationsRead: (markedReadConversations, messageType) => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations, messageType } }),
      setMessageFilter: messageFilter => dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
      clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
      deleteMessageConversations: (messageConversationIds, messageType) => dispatch({ type: actions.DELETE_MESSAGE_CONVERSATIONS, payload: { messageConversationIds, messageType } }),
    }),
  ),
)(MessagingCenter);