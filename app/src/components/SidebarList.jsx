import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader/Subheader';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import MessageTypeItem from './MessageTypeItem'

import theme from '../styles/theme';
import * as actions from 'constants/actions';

/*const mapChildren = gridColumn == 2 ? _.filter( children, (child) => {
   return (
     child.displayName.includes(messageFilter) &&
     messageType != 'PRIVATE' && _.filter(child.messages, (message) => {
       message.sender.displayName.includes(messageFilter) &&
         message.text.includes(messageFilter)
     })
   )
 }) : children*/

class SidebarList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.setSelectedMessageType( this.props.match.params.messageType );
  }

  render() {
    const gridColumn = this.props.gridColumn;
    const messageType = this.props.match.params.messageType;
    const routeValue = gridColumn == 1 ? messageType : this.props.location.pathname.split('/').slice(-1)[0];
    const relativePath = gridColumn == 1 ? "/" : "/" + messageType + "/";
    const children = this.props.children;

    const loading = !_.find(this.props.messageTypes, {id: messageType}).loading

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 95px)',
        gridArea: '2 / ' + gridColumn + ' / span 1 / span 1',
        borderLeftStyle: gridColumn == 2 && 'solid',
        borderLeftWidth: '0.5px',
        borderLeftColor: theme.palette.accent4Color,
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: theme.palette.accent4Color,
        overflowY: 'scroll'
      }}
      >
        <div>
          <List style={{
            padding: '0px',
            height: 'calc(100vh - 100px)',
          }} >
            {(!children || children.length == 0) && this.props.loaded && <Subheader >No message conversations</Subheader>}
            {children &&
              children.map(child => {
                return (
                  <div key={child.id}>
                    <MessageTypeItem
                      child={child}
                      onClick={() => this.props.setSelectedMessageType(child.id)}
                      gridColumn={gridColumn}
                      selectedValue={routeValue}
                      relativePath={relativePath}
                      messageType={messageType}
                      loading={loading}
                      />
                    <Divider />
                  </div>
                )
              })}
          </List>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => {
      return {
        messageTypes: state.messaging.messageTypes,
      };
    },
    dispatch => ({
      setSelectedMessageType: (messageTypeId) => dispatch({ type: actions.SET_SELECTED_MESSAGE_TYPE, payload: { messageTypeId } }),
    }),
  ),
  pure,
)(SidebarList);