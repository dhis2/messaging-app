import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { pinkA200 } from 'material-ui/styles/colors';

import * as actions from 'constants/actions';
import { compose, pure, lifecycle } from 'recompose';

const DEFAULT_MESSAGE_DURATION = 4000;

class CustomSnackBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    componentWillReceiveProps() {
        this.setState({
            show: true,
        });
    }

    closeMessage() {
        this.props.clearSnackMessage();
        this.setState({
            show: false,
        });
    }

    render() {
        return (
            <Snackbar
                open={this.props.message != '' && this.state.show}
                message={this.props.message}
                autoHideDuration={DEFAULT_MESSAGE_DURATION}
                onRequestClose={this.closeMessage}
                contentStyle={{ color: this.props.type === 'NEGATIVE' ? pinkA200 : 'white' }}
                style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
                bodyStyle={{ pointerEvents: 'initial', maxWidth: 'none' }}
            />
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                message: state.messaging.snackMessage,
                type: state.messaging.snackType,
            };
        },
        dispatch => ({
            clearSnackMessage: () => dispatch({ type: actions.CLEAR_SNACK_MESSAGE }),
        }),
    ),
    pure,
)(CustomSnackBar);
