import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import CreateMessageIcon from 'material-ui-icons/Add';
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
import MessagePanel from './MessagePanel';
import FullWidthList from './FullWidthList';
import CreateMessage from './CreateMessage';


/*
<SidebarList
            {...this.props}
            gridColumn={2}
            children={selectedMessageTypeConversations}
            loadMoreMessageConversations={this.loadMoreMessageConversations.bind(this)}
          />
          :*/

const flatButtonHeight = '40px'
const styles = {
  toggleContainer: {
    width: '50px',
  },
  toggleTrack: {
    backgroundColor: '#dddddd',
  },
}

class MessagingCenter extends Component {
  state = {
  };

  constructor(props) {
    super(props)

    this.state = {
      wideview: false,
    };
  }

  componentWillMount() {
    this.props.messageTypes.map(messageType => {
      this.props.loadMessageConversations(messageType.id, messageType.page);
    })

    this.props.loadMessageConversationsFinished();
  }

  loadMoreMessageConversations(messageType) {
    let messageTypeState = _.find(this.props.messageTypes, { id: messageType });
    this.props.loadMessageConversations(messageTypeState.id, messageTypeState.page + 1);
  }

  toogleWideview() {
    this.setState({ wideview: !this.state.wideview })
  }

  render() {
    const messageType = this.props.match.params.messageType
    let selectedMessageTypeConversations = this.props.messageConversations[messageType];

    const id = this.props.location.pathname.split('/').slice(-1)[0];
    const displayMessagePanel = _.find(this.props.messageTypes, { id: id }) == undefined

    console.log(id, displayMessagePanel)
    
    return (
      <div style={grid} >
        <FlatButton
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gridRow: '1',
            gridColumn: '1',
            height: flatButtonHeight,
            width: '150px'
          }}
          icon={<CreateMessageIcon />}
          containerElement={<Link to={messageType + "/create"} />}
          label="Compose"
        />
        <TextField
          style={{
            gridRow: '1',
            gridColumn: '2',
            height: flatButtonHeight,
          }}
          fullWidth
          hintText={'Search'}
          onChange={(event, messageFilter) => this.props.setMessageFilter(messageFilter)}
          type="search"
          margin="normal"
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <FlatButton
            style={{ textAlign: 'right', marginRight: '5px' }}
            icon={<ViewList style={{ marginRight: '5px' }} />}
            onClick={() => this.toogleWideview()} />
        </div>

        <SidebarList {...this.props} gridColumn={1} children={this.props.messageTypes} />

        {id == 'create' ?
          <CreateMessage />
          :
          <FullWidthList wideview={this.state.wideview} messageType={messageType} children={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
        }

        {displayMessagePanel ?
          <MessagePanel wideview={this.state.wideview} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
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
        loaded: state.messaging.loaded,
      };
    },
    dispatch => ({
      loadMessageConversations: (messageType, page) => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: { messageType, page } }),
      loadMessageConversationsFinished: () => dispatch({ type: actions.MESSAGE_CONVERSATIONS_LOAD_FINISHED }),
      markMessageConversationsUnread: markedUnreadConversations => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations } }),
      setMessageFilter: messageFilter => dispatch({ type: actions.SET_MESSAGE_FILTER, payload: { messageFilter } }),
    }),
  ),
  pure,
)(MessagingCenter);