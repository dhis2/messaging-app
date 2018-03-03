import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import messageTypes from '../constants/messageTypes';
import * as actions from 'constants/actions';

import theme from '../styles/theme';
import CustomDrawer from './CustomDrawer';

class MessagePanel extends Component {
  state = {

  } 

  constructor(props) {
    super(props)
  }

  render() {
    const id = this.props.messageConversationId;
    const messageConversation = _.find(this.props.messageConversations, {id:id});

    return(
      <div>
        {
          messageConversation && messageConversation.messages.map(message => {
            return 'PLACEHOLDER'
          })
        }
      </div>
  )};
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
    }),
  ),
  pure,
)(MessagePanel);