import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';

import {List, ListItem} from 'material-ui/List';

import ListItems from './ListItems';

import theme from '../styles/theme';
import * as actions from 'constants/actions';

class CustomList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const messageType = this.props.match.params.messageType;
    const routeValue = this.props.gridColumn == 1 ? messageType : this.props.location.pathname.split('/').slice(-1)[0];
    const relativePath = this.props.gridColumn == 1 ? "/" : "/" + messageType + "/";

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gridColumn: this.props.gridColumn + '',
        gridRow: '2',
        backgroundColor: theme.palette.canvasColor,
        zIndex: '1',
        boxShadow: '0px 0px 2px #444444',
        overflowY: 'scroll'
      }}
      >
        <div>
          {!this.props.loaded && this.props.gridColumn == 1 &&
            <CircularProgress color={theme.palette.primary2Color} />
          }
          <ListItems
            messageType={messageType}
            messageFilter={this.props.messageFilter}
            selectedValue={routeValue} children={this.props.children}
            relativePath={relativePath} loaded={this.props.loaded}
            gridColumn={this.props.gridColumn}
            loadMoreMessageConversations={this.props.loadMoreMessageConversations}
            markUnread={this.props.markUnread} />
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => {
      return {
        loaded: state.messaging.loaded,
        messageFilter: state.messaging.messsageFilter,
      };
    },
    dispatch => ({
      markMessageConversationsUnread: markedUnreadConversations => dispatch({ type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD, payload: { markedUnreadConversations } }),
    }),
  ),
  pure,
)(CustomList);