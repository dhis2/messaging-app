import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { Tabs, Tab } from 'material-ui/Tabs'

import CreateMessage from './CreateMessage'

import { tabsStyles, messagePanelListContainer } from '../styles/style';

const statusList = [{ key: 'ALL', displayName: 'All' }, { key: 'OPEN', displayName: 'OPEN' }, { key: 'PENDING', displayName: 'PENDING' }, { key: 'SOLVED', displayName: 'SOLVED' }]
class MessagePanelList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const id = this.props.pathname.split('/').slice(-1)[0];
    
    return (
      <div style={messagePanelListContainer}>
        {id == 'create' ?
          <CreateMessage />
          :
          <Tabs>
            {statusList.map(status => {
              return (
                <Tab
                  style={tabsStyles.tabItem}
                  key={status.key}
                  label={status.displayName}
                />
              )
            })}
          </Tabs>}
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return state
    },
    dispatch => ({
      markMessageConversationsRead: markedReadConversations => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_READ, payload: { markedReadConversations } }),
    }),
  ),
  pure,
)(MessagePanelList);