import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from 'constants/actions';
import { compose, pure, lifecycle } from 'recompose';

import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import SuggestionField from './SuggestionField';

class AssignToDialog extends Component {
  constructor(props) {
    super(props)

    this.state = {
      assignId: undefined,
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onRequestClose={() => {
          this.props.selectedList.length > 0 && this.props.updateMessageConversations(this.props.selectedList.map(id => id.id)[0])
          this.props.onRequestClose();
        }}
      >
        <SuggestionField
          key={'suggestionField'}
          label={'Assignee'}
        />
      </Dialog>
    )
  }
}

export default compose(
  connect(
    state => {
      return {
        selectedList: state.recipient.selected,
      }
    }
    ,
    dispatch => ({
    }),
  ),
)(AssignToDialog);