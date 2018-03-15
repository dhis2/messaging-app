import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import FlatButton from 'material-ui/FlatButton';
import CreateMessageIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import ViewList from 'material-ui-icons/ViewList';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import { grid } from '../styles/style';

import CustomList from './CustomList';
import MessagePanel from './MessagePanel';
import MessagePanelList from './MessagePanelList';

const flatButtonHeight = '40px'

class MessagingCenter extends Component {
  state = {
  };

  constructor(props) {
    super(props)

    this.state = {
      listview: true,
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

  toogleListView() {
    this.setState({ listview: !this.state.listview })
  }

  render() {
    const messageType = this.props.match.params.messageType
    const selectedMessageTypeConversations = this.props.messageConversations[messageType];

    return (
      <div style={grid} >
        <FlatButton style={{
          gridRow: '1',
          gridColumn: '1',
          textAlign: 'left',
          height: flatButtonHeight,
        }}
          icon={<CreateMessageIcon />}
          containerElement={<Link to={messageType + "/create"} />}
          label="New message"
        />
        <TextField
          style={{
            gridRow: '1',
            gridColumn: '2',
          }}
          fullWidth
          hintText={'Search'}
          onChange={(event, messageFilter) => this.props.setMessageFilter(messageFilter)}
          type="search"
          margin="normal"
        />
        <FlatButton style={{
          height: flatButtonHeight,
          gridRow: '1',
          gridColumn: '3',
          justifySelf: 'end'
        }}
          icon={<ViewList />}
          onClick={(event) => this.toogleListView()}
        />

        <CustomList {...this.props} gridColumn={1} children={this.props.messageTypes} />
        {!this.state.listview && <CustomList
          {...this.props}
          gridColumn={2}
          children={selectedMessageTypeConversations}
          loadMoreMessageConversations={this.loadMoreMessageConversations.bind(this)}
          markUnread={(child) => {
            this.props.markMessageConversationsUnread( [child.id])
          }} />}
        {this.state.listview ?
          <MessagePanelList gridColumn={3} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
          : <MessagePanel gridColumn={3} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />}
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