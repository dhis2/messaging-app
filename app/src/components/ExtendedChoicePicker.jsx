import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import CustomDropDown from './CustomDropDown';
import MenuItem from 'material-ui/MenuItem';

import SuggestionField from './SuggestionField';

import * as actions from 'constants/actions';

class ExtendedChoicePicker extends Component {
  constructor(props) {
    super(props)
  }

  updateMessageConversation = (messageConversationIds, identifier, value) => {
    this.props.updateMessageConversations(messageConversationIds, identifier, value, this.props.selectedMessageType)
    this.props.clearCheckedIds && this.props.clearCheckedIds()
  }

  markUnread = (child) => {
    this.props.markMessageConversationsUnread([child.id], this.props.selectedMessageType)
  }

  deleteMessageConversations = (child) => {
    this.props.deleteMessageConversation(child.id, this.props.selectedMessageType)
  }

  render() {
    const messageConversation = this.props.messageConversation;
    const multiSelect = !messageConversation;
    const assigneValue = multiSelect ? '' : messageConversation.assignee != undefined ? messageConversation.assignee.displayName : 'None';

    return (
      <div style={{
        gridArea: '1 / 4 / span 2 / span 1',
        display: 'grid',
        gridTemplateColumns: '33% 33% 33%',
      }}>
        <CustomDropDown
          gridColumn={1}
          floatingLabelText={'Status'}
          onChange={(event, key, value) => {console.log(event, key, value) 
            this.updateMessageConversation( multiSelect ? this.props.checkedIds.map(id => id.id) : [messageConversation.id], 'STATUS', value )}}
          value={!multiSelect && messageConversation.status}
          children={
            [
              <MenuItem key={'OPEN'} value={'OPEN'} primaryText="Open" />,
              <MenuItem key={'PENDING'} value={'PENDING'} primaryText="Pending" />,
              <MenuItem key={'INVALID'} value={'INVALID'} primaryText="Invalid" />,
              <MenuItem key={'SOLVED'} value={'SOLVED'} primaryText="Solved" />
            ]
          }
        />
        <CustomDropDown
          gridColumn={2}
          floatingLabelText={'Priority'}
          onChange={(event, key, value) => this.updateMessageConversation( multiSelect ? this.props.checkedIds.map(id => id.id) : [messageConversation.id], 'PRIORITY', value )}
          value={!multiSelect && messageConversation.priority}
          children={
            [
              <MenuItem key={'LOW'} value={'LOW'} primaryText="Low" />,
              <MenuItem key={'MEDIUM'} value={'MEDIUM'} primaryText="Medium" />,
              <MenuItem key={'HIGH'} value={'HIGH'} primaryText="High" />
            ]
          }
        />
        <CustomDropDown
          gridColumn={3}
          floatingLabelText={'Assignee'}
          value={assigneValue}
          children={
            [
              <MenuItem key={assigneValue} value={assigneValue} primaryText={assigneValue} />,
              <SuggestionField
                updateMessageConversation={(chip) => this.updateMessageConversation( multiSelect ? this.props.checkedIds.map(id => id.id) : [messageConversation.id], 'ASSIGNEE', chip.id )}
                key={'suggestionField'}
                label={'Assignee'}
              />
            ]
          }
        />
      </div>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        selectedMessageType: state.messaging.selectedMessageType,
        checkedIds: state.messaging.checkedIds,
      }
    }
    ,
    dispatch => ({
      updateMessageConversations: (messageConversationIds, identifier, value, messageType) => dispatch({ type: actions.UPDATE_MESSAGE_CONVERSATIONS, payload: { messageConversationIds, identifier, value, messageType } }),
    }),
  ),
)(ExtendedChoicePicker);