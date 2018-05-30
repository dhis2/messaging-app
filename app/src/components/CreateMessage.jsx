import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader/Subheader';

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
            this.props.recipients.length === 0;
        this.setState({
            inputError: this.props.input === '',
            subjectError: this.props.subject === '',
            recipientError: this.props.recipients.length === 0,
        });
        if (!error) {
            const messageType = _.find(this.props.messageTypes, { id: 'PRIVATE' });
            const users = this.props.recipients.filter(r => r.type === 'user');
            const userGroups = this.props.recipients.filter(r => r.type === 'userGroup');
            const organisationUnits = this.props.recipients.filter(
                r => r.type === 'organisationUnit',
            );
            this.props.sendMessage(
                this.state.subject,
                users,
                userGroups,
                organisationUnits,
                this.state.input,
                generateUid(),
                messageType,
            );
            history.push('/PRIVATE');
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
                            label={'To'}
                            recipients={this.props.recipients}
                            updateRecipients={this.updateRecipients}
                            errorText={this.state.recipientError ? 'This field is required' : ''}
                        />
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
                            <FlatButton label="Send" onClick={() => this.sendMessage()} />
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
