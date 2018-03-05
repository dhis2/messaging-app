import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import InboxHeader from './InboxHeader';
import CustomList from './CustomList';
import MessagePanel from './MessagePanel';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '15% 20% 65%',
    paddingTop: '46px',
    width: '100%',
    height: '100%',
    position: 'fixed',
    backgroundColor: theme.palette.accent2Color,
  }
}

class MessagingCenter extends Component {
  state = {

  }

  render() {
    const selectedMessageTypeConversations = this.props.messageConversations[this.props.match.params.messageType];

    return (
      <div style={styles.grid} >
        <InboxHeader />
        <CustomList gridColumn={1} props={this.props} children={messageTypes} />
        <CustomList gridColumn={2} props={this.props} children={selectedMessageTypeConversations} />
        <MessagePanel gridColumn={3} selectedMessageTypeConversations={selectedMessageTypeConversations} pathname={this.props.location.pathname} />
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        messageConversations: state.messaging.messageConversations,
        loaded: state.messaging.loaded,
      };
    },
    dispatch => ({
      loadMessageConversations: messageType => dispatch({ type: actions.LOAD_MESSAGE_CONVERSATIONS, payload: {messageType} }),
      loadMessageConversationsFinished: () => dispatch({ type: actions.MESSAGE_CONVERSATIONS_LOAD_FINISHED }),
    }),
  ),
  lifecycle({
    componentWillMount() {
        messageTypes.map( messageType => {
          this.props.loadMessageConversations( messageType.id );
        })

        this.props.loadMessageConversationsFinished();
    },
  }),
  pure,
)(MessagingCenter);