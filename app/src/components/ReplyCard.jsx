import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import * as actions from 'constants/actions';
import theme from '../styles/theme';
import { cardStyles } from '../styles/style';
import history from 'utils/history';

import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development';

class ReplyCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            discardState: false,
        };
    }

    animateScroll = duration => {
        const messagepanel = document.getElementById('messageconversation');

        var start = messagepanel.scrollTop;
        var end = messagepanel.scrollHeight;
        var change = end - start;
        var increment = 5;

        function easeInOut(currentTime, start, change, duration) {
            currentTime /= duration / 2;
            if (currentTime < 1) {
                return (change / 2) * currentTime * currentTime + start;
            }
            currentTime -= 1;
            return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
        }

        function animate(elapsedTime) {
            elapsedTime += increment;
            var position = easeInOut(elapsedTime, start, change, duration);
            messagepanel.scrollTop = position;
            if (elapsedTime < duration) {
                setTimeout(function() {
                    animate(elapsedTime);
                }, increment);
            }
        }
        animate(0);
    };

    handleExpandChange = expanded => {
        this.animateScroll(500);

        this.setState({ expanded: expanded, inputError: false });
    };

    texFieldUpdate = (event, newValue) => {
        this.props.updateInputFields('', newValue, []);
    };

    replyMessage = internalReply => {
        this.props.replyMessage(
            this.props.input,
            internalReply,
            this.props.selectedMessageConversation,
            this.props.selectedMessageType,
        );
        this.wipeInput();
    };

    wipeInput = () => {
        this.props.updateInputFields('', '', []);
        this.setState({
            inputError: false,
        });
    };

    render() {
        return (
            <Card
                style={{
                    marginTop: '5px',
                    gridArea: this.props.gridArea,
                }}
                expanded
            >
                <CardText style={{ padding: '0px 0px 0px 16px' }}>
                    <TextField
                        key={this.props.messageConversation.id}
                        id={this.props.messageConversation.id}
                        rows={5}
                        underlineShow={false}
                        value={this.state.discardState ? '' : this.props.input}
                        multiLine
                        fullWidth
                        floatingLabelText="Message"
                        onChange={this.texFieldUpdate}
                    />

                    <CardActions>
                        <RaisedButton
                            primary
                            label="Reply"
                            disabled={
                                this.props.input === '' || this.state.discardState ? true : false
                            }
                            onClick={() => this.replyMessage(false)}
                        />
                        {this.props.isInFeedbackRecipientGroup &&
                            this.props.selectedMessageType.id === 'TICKET' && (
                                <FlatButton
                                    primary
                                    label="Internal reply"
                                    disabled={
                                        this.props.input === '' || this.state.discardState
                                            ? true
                                            : false
                                    }
                                    onClick={() => this.replyMessage(true)}
                                />
                            )}
                        <FlatButton
                            label="Discard"
                            disabled={
                                this.props.input === '' || this.state.discardState ? true : false
                            }
                            onClick={() => {
                                this.setState({ discardState: true });
                                this.props.displaySnackMessage(
                                    'Reply discarded',
                                    () => this.setState({ discardState: false }),
                                    () => {
                                        this.setState({ discardState: false });
                                        this.wipeInput();
                                    },
                                    NEGATIVE,
                                );
                                this.setState({
                                    expanded: false,
                                });
                            }}
                        />
                    </CardActions>
                </CardText>
            </Card>
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                selectedMessageConversation: state.messaging.selectedMessageConversation,
                selectedMessageType: state.messaging.selectedMessageType,
                messageTypes: state.messaging.messageTypes,
                input: state.messaging.input,
                isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
            };
        },
        dispatch => ({
            replyMessage: (message, internalReply, messageConversation, messageType) =>
                dispatch({
                    type: actions.REPLY_MESSAGE,
                    payload: {
                        message,
                        internalReply,
                        messageConversation,
                        messageType,
                    },
                }),
            setSelectedMessageType: messageTypeId =>
                dispatch({ type: actions.SET_SELECTED_MESSAGE_TYPE, payload: { messageTypeId } }),
            updateInputFields: (subject, input, recipients) =>
                dispatch({
                    type: actions.UPDATE_INPUT_FIELDS,
                    payload: { subject, input, recipients },
                }),
            displaySnackMessage: (message, onSnackActionClick, onSnackRequestClose, snackType) =>
                dispatch({
                    type: actions.DISPLAY_SNACK_MESSAGE,
                    payload: { message, onSnackActionClick, onSnackRequestClose, snackType },
                }),
        }),
    ),
    pure,
)(ReplyCard);
