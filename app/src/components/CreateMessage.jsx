import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader/Subheader';
import Checkbox from 'material-ui/Checkbox';

import * as actions from 'constants/actions';
import theme from '../styles/theme';
import { messageConversationContainer, subheader } from '../styles/style';
import history from 'utils/history';

import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development';

import { generateUid } from 'd2/lib/uid';

class CreateMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subjectError: false,
            inputError: false,
            recipientError: false,
            snackbarOpen: false,
            isMessageFeedback: false,
        };
    }

    subjectUpdate = (event, newValue) => {
        this.props.updateInputFields(newValue, this.props.input, this.props.recipients);
    };

    inputUpdate = (event, newValue) => {
        this.props.updateInputFields(this.props.subject, newValue, this.props.recipients);
    };

    updateRecipients = recipients => {
        this.props.updateInputFields(this.props.subject, this.props.input, recipients);
    };

    sendMessage = () => {
        const error =
            this.props.input === '' ||
            this.props.subject === '' ||
            (this.props.recipients.length === 0 && !this.state.isMessageFeedback);
        this.setState({
            inputError: this.props.input === '',
            subjectError: this.props.subject === '',
            recipientError: this.props.recipients.length === 0 && !this.state.isMessageFeedback,
        });
        if (!error) {
            const messageType = _.find(this.props.messageTypes, {
                id: this.state.isMessageFeedback ? 'TICKET' : 'PRIVATE',
            });
            const users = this.props.recipients.filter(r => r.type === 'user');
            const userGroups = this.props.recipients.filter(r => r.type === 'userGroup');
            const organisationUnits = this.props.recipients.filter(
                r => r.type === 'organisationUnit',
            );

            if (this.state.isMessageFeedback) {
                this.props.sendFeedbackMessage(this.props.subject, this.props.input, messageType);
                history.push('/TICKET');
            } else {
                this.props.sendMessage(
                    this.props.subject,
                    users,
                    userGroups,
                    organisationUnits,
                    this.props.input,
                    generateUid(),
                    messageType,
                );
                history.push('/PRIVATE');
            }
        }
    };

    wipeInput = () => {
        this.props.updateInputFields('', '', []);
    };

    render() {
        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 9'
            : '2 / 4 / span 1 / span 7';
        return (
            <div
                style={{
                    gridArea,
                    margin: '10px',
                }}
            >
                <Subheader style={subheader}> {'Create'}</Subheader>
                <Card>
                    <CardText>
                        <SuggestionField
                            style={{ margin: '0px' }}
                            label={'To'}
                            disabled={this.state.isMessageFeedback}
                            recipients={this.props.recipients}
                            updateRecipients={this.updateRecipients}
                            errorText={
                                this.state.recipientError && !this.state.isMessageFeedback
                                    ? 'This field is required'
                                    : ''
                            }
                        />
                        <div style={{ marginTop: '10px' }}>
                            <Checkbox
                                label="Feedback message"
                                checked={this.state.isMessageFeedback}
                                onCheck={(event, isInputChecked) => {
                                    this.setState({
                                        isMessageFeedback: !this.state.isMessageFeedback,
                                    });
                                }}
                            />
                        </div>
                        <TextField
                            floatingLabelText="Subject"
                            fullWidth
                            value={this.props.subject}
                            errorText={this.state.subjectError ? 'This field is required' : ''}
                            onChange={this.subjectUpdate}
                        />
                        <TextField
                            key={'createMessage'}
                            id={'createMessage'}
                            rows={5}
                            underlineShow={false}
                            value={this.props.input}
                            multiLine
                            fullWidth
                            floatingLabelText="Message"
                            errorText={this.state.inputError ? 'This field is required' : ''}
                            onChange={this.inputUpdate}
                        />
                        <CardActions>
                            <RaisedButton primary label="Send" onClick={() => this.sendMessage()} />
                            <FlatButton
                                label="Discard"
                                onClick={() => {
                                    this.props.displaySnackMessage(
                                        'Message discarded',
                                        () => history.push('/PRIVATE/create'),
                                        () => this.wipeInput(),
                                        NEGATIVE,
                                    );
                                    history.push('/PRIVATE');
                                }}
                            />
                        </CardActions>
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default compose(
    connect(
        state => {
            return {
                messageTypes: state.messaging.messageTypes,
                subject: state.messaging.subject,
                input: state.messaging.input,
                recipients: state.messaging.recipients,
            };
        },
        dispatch => ({
            sendMessage: (
                subject,
                users,
                userGroups,
                organisationUnits,
                message,
                messageConversationId,
                messageType,
            ) =>
                dispatch({
                    type: actions.SEND_MESSAGE,
                    payload: {
                        subject,
                        users,
                        userGroups,
                        organisationUnits,
                        message,
                        messageConversationId,
                        messageType,
                    },
                }),
            sendFeedbackMessage: (subject, message, messageType) =>
                dispatch({
                    type: actions.SEND_FEEDBACK_MESSAGE,
                    payload: {
                        subject,
                        message,
                        messageType,
                    },
                }),
            displaySnackMessage: (message, onSnackActionClick, onSnackRequestClose, snackType) =>
                dispatch({
                    type: actions.DISPLAY_SNACK_MESSAGE,
                    payload: { message, onSnackActionClick, onSnackRequestClose, snackType },
                }),
            updateInputFields: (subject, input, recipients) =>
                dispatch({
                    type: actions.UPDATE_INPUT_FIELDS,
                    payload: { subject, input, recipients },
                }),
        }),
    ),
    pure,
)(CreateMessage);
