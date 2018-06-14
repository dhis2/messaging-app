import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import { Card, CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import i18n from 'd2-i18n';

import * as actions from 'constants/actions';

import { NEGATIVE } from '../constants/development';

class ReplyCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            discardState: false,
        };
    }

    componentWillUnmount() {
        this.wipeInput();
    }

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

    texFieldUpdate = (event, newValue) => {
        this.props.updateInputFields('', newValue, []);
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
                        floatingLabelText={i18n.t('Message')}
                        onChange={this.texFieldUpdate}
                    />

                    <CardActions>
                        <RaisedButton
                            primary
                            label={i18n.t('Reply')}
                            disabled={this.props.input === '' || this.state.discardState}
                            onClick={() => this.replyMessage(false)}
                        />
                        {this.props.isInFeedbackRecipientGroup &&
                            this.props.selectedMessageType.id === 'TICKET' && (
                                <FlatButton
                                    primary
                                    label={i18n.t('Internal reply')}
                                    disabled={this.props.input === '' || this.state.discardState}
                                    onClick={() => this.replyMessage(true)}
                                />
                            )}
                        <FlatButton
                            label={i18n.t('Discard')}
                            disabled={this.props.input === '' || this.state.discardState}
                            onClick={() => {
                                this.setState({ discardState: true });
                                this.props.displaySnackMessage(
                                    i18n.t('Reply discarded'),
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
        state => ({
            selectedMessageConversation: state.messaging.selectedMessageConversation,
            selectedMessageType: state.messaging.selectedMessageType,
            messageTypes: state.messaging.messageTypes,
            input: state.messaging.input,
            isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
        }),
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
