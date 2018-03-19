import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import CreateMessageIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ViewList from 'material-ui-icons/ViewList';
import { ToolbarSeparator } from 'material-ui/Toolbar';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid } from '../styles/style';

import SidebarList from './SidebarList';
import MessagePanel from './MessagePanel';
import FullWidthList from './FullWidthList';

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
      wideview: true,
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

    return (
      <div style={grid} >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gridRow: '1',
          gridColumn: '1',
          height: flatButtonHeight,
        }}>
        <FlatButton 
          icon={<CreateMessageIcon />}
          containerElement={<Link to={messageType + "/create"} />}
          label="Compose"
        />
        <ToolbarSeparator/>
        </div>
        <TextField
          style={{
            gridRow: '1',
            gridColumn: '2',
            marginLeft: '15px',
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
            style={{width: '40px', marginRight: '15px'}}
            icon={<ViewList />}
            onClick={() => this.toogleWideview()} />
        </div>

        <SidebarList {...this.props} gridColumn={1} children={this.props.messageTypes} />
        {!this.state.wideview ?
          <SidebarList
            {...this.props}
            gridColumn={2}
            children={selectedMessageTypeConversations}
            loadMoreMessageConversations={this.loadMoreMessageConversations.bind(this)}
           />
          :
          <FullWidthList messageType={messageType} children={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
        }
        <MessagePanel wideview={this.state.wideview} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
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