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
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={() => {
                    this.props.onRequestClose();
                }}
            >
                <SuggestionField
                    onSuggestionClick={chip => {
                        this.props.updateMessageConversations([chip.id]);
                        this.props.onRequestClose();
                    }}
                    searchOnlyUsers={true}
                    recipients={[]}
                    key={'suggestionField'}
                    label={'Assignee'}
                />
            </Dialog>
        );
    }
}

export default compose(
    connect(
        state => {
            return {};
        },
        dispatch => ({}),
    ),
)(AssignToDialog);
