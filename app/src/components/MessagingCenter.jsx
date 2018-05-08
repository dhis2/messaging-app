import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

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
import ExtendedChoicePicker from './ExtendedChoicePicker';
import CreateMessage from './CreateMessage';

import ToolbarExtendedChoicePicker from './ToolbarExtendedChoicePicker';

import history from 'utils/history';

const headerHight = '48px';
const EXTENDED_CHOICES = ['TICKET', 'VALIDATION_RESULT']

class MessagingCenter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      checkedItems: false,
      dialogOpen: false,
    };
  }

  componentWillMount() {
    const selectedMessageType = this.props.match.params.messageType;
    const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

    this.props.messageTypes.map(messageType => {
      this.props.loadMessageConversations(messageType, selectedMessageType, selectedId);
    })
  }

  loadMoreMessageConversations(messageType) {
    let messageTypeState = _.find(this.props.messageTypes, { id: messageType });
    this.props.loadMessageConversations(messageTypeState.id, messageTypeState.page + 1);
  }

  componentDidUpdate() {
    const selectedMessageType = this.props.match.params.messageType
    const selectedId = this.props.location.pathname.split('/').slice(-1)[0];

    if (selectedMessageType != selectedId) {
      const messageConversation = _.find(this.props.messageConversations[selectedMessageType], { 'id': selectedId })
      this.props.setSelectedMessageConversation(messageConversation)
    } else {
      this.props.setSelectedMessageConversation(undefined)
    }
  }

  toogleWideview() {
    this.setState({ wideview: !this.state.wideview })
  }

  render() {
    const messageType = this.props.match.params.messageType;
    const id = this.props.location.pathname.split('/').slice(-1)[0];
    const checkedOptions = this.props.checkedOptions;
    const displayExtendedChoices = this.props.selectedMessageType ? !!(EXTENDED_CHOICES.indexOf(this.props.selectedMessageType.id) + 1) : false;

    return (
      <div style={grid} >
        <Paper style={{
          gridArea: '1 / 1 / span 1 / span 3',
          display: 'grid',
          gridTemplateColumns: 'minmax(150px, 15%) 20% 65%',
          backgroundColor: checkedOptions ? theme.palette.accent3Color : theme.palette.accent2Color,
          zIndex: 10,
        }}>
          {messageType == 'PRIVATE' && <FlatButton
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              gridArea: '1 / 1',
              width: '150px'
            }}
            icon={!checkedOptions ? <CreateMessageIcon /> : <NavigationBack />}
            onClick={() => checkedOptions ? this.props.clearCheckedIds() : history.push('/' + messageType + '/create')}
            label={checkedOptions ? "Back" : "Compose"}
          />}
          {!checkedOptions && <TextField
            style={{
              gridArea: '1 / 2',
              height: headerHight,
              padding: '0px 0px'
            }}
            fullWidth
            hintText={'Search'}
            onChange={(event, messageFilter) => this.props.setMessageFilter(messageFilter)}
            type="search"
            margin="normal"
          />}

          {checkedOptions && <ToolbarExtendedChoicePicker displayExtendedChoices={displayExtendedChoices}/>}
          <div style={{
              gridArea: '1 / 3',
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
        </Paper>

        <SidebarList {...this.props} drawerOpen={this.state.drawerOpen} gridColumn={1} messageTypes={this.props.messageTypes} />

        {id == 'create' &&
          <CreateMessage wideview={this.state.wideview} />}

        {
          id != 'create' ? 
            <MessageConversationList wideview={this.state.wideview} displayExtendedChoices={displayExtendedChoices && this.state.wideview } />
           : !this.state.wideview &&
            <MessageConversationList wideview={this.state.wideview} displayExtendedChoices={displayExtendedChoices && this.state.wideview } />
        }

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
      return {
        messageTypes: state.messaging.messageTypes,
        messageConversations: state.messaging.messageConversations,
        selectedMessageType: state.messaging.selectedMessageType,
        selectedMessageConversation: state.messaging.selectedMessageConversation,
        checkedIds: state.messaging.checkedIds,
        checkedOptions: state.messaging.checkedIds.length > 0,
        loaded: state.messaging.loaded,
      }
    },
    dispatch => ({
      loadMessageConversations: (messageType, selectedMessageType, selectedId) => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: { messageType, selectedMessageType, selectedId } }),
      setMessageFilter: messageFilter => dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
      clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
      setSelectedMessageConversation: (messageConversation) => dispatch({ type: actions.SET_SELECTED_MESSAGE_CONVERSATION, payload: { messageConversation } }),
    }),
  ),
)(MessagingCenter);