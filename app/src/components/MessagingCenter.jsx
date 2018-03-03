import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import CustomDrawer from './CustomDrawer';
import MessagePanel from './MessagePanel';

class MessagingCenter extends Component {
  state = {

  } 

  render = () => (
    <div>
        <CustomDrawer drawerLevel={0} props={this.props} children={messageTypes} open={this.props.open} width={'220px'} />
        <CustomDrawer drawerLevel={1} props={this.props} children={this.props.messageConversations} open={this.props.open} width={'350px'}/>
        <MessagePanel messageConversationId={this.props.match.params.messageConversationId} />
    </div>
  );
}

export default compose(
  connect(
    state => {
      return {
        open: true,
        messageConversations: state.messaging.messageConversations,
      };
    },
    dispatch => ({
      loadMessageConversations: messageType => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: {messageType} }),
    }),
  ),
  lifecycle({
    componentWillMount() {
        const messageType = this.props.match.params.messageType;
        this.props.loadMessageConversations( messageType );
    },
    componentWillReceiveProps(nextProps) {
      const messageType = nextProps.match.params.messageType;
      const prevMessageType = this.props.match.params.messageType;
      if (messageType !== prevMessageType) {
        this.props.loadMessageConversations( messageType );
      }
    },
}),
  pure,
)(MessagingCenter);