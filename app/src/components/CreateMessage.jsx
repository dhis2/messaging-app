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
import RadioButton from 'material-ui/RadioButton';

import i18n from 'd2-i18n';

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
        const messageType = _.find(this.props.messageTypes, {
            id: this.state.isMessageFeedback ? 'TICKET' : 'PRIVATE',
        });
        const users = this.props.recipients.filter(r => r.type === 'user');
        const userGroups = this.props.recipients.filter(r => r.type === 'userGroup');
        const organisationUnits = this.props.recipients.filter(r => r.type === 'organisationUnit');

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
    };

    wipeInput = () => {
        this.props.updateInputFields('', '', []);
    };

    render() {
        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 9'
            : '2 / 4 / span 1 / span 7';
        const disabled =
            this.props.subject === '' ||
            this.props.input === '' ||
            this.props.recipients.length === 0
                ? true
                : false;

        return (
            <div
                style={{
                    gridArea,
                    margin: '10px',
                }}
            >
                <Subheader style={subheader}> {i18n.t('Create')}</Subheader>
                <Card>
                    <CardText>
                        <SuggestionField
                            style={{ margin: '0px' }}
                            label={i18n.t('To')}
                            disabled={this.state.isMessageFeedback}
                            recipients={this.props.recipients}
                            updateRecipients={this.updateRecipients}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <RadioButton
                                label={i18n.t('Private message')}
                                checked={!this.state.isMessageFeedback}
                                onCheck={(event, isInputChecked) => {
                                    this.updateRecipients([]);
                                    this.setState({
                                        isMessageFeedback: !this.state.isMessageFeedback,
                                    });
                                }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <RadioButton
                                label={i18n.t('Feedback message')}
                                checked={this.state.isMessageFeedback}
                                onCheck={(event, isInputChecked) => {
                                    this.updateRecipients([]);
                                    this.updateRecipients([
                                        {
                                            id: 'id',
                                            displayName: i18n.t('Feedback recipient group'),
                                        },
                                    ]);
                                    this.setState({
                                        isMessageFeedback: !this.state.isMessageFeedback,
                                    });
                                }}
                            />
                        </div>
                        <TextField
                            floatingLabelText={i18n.t('Subject')}
                            fullWidth
                            value={this.props.subject}
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
                            floatingLabelText={i18n.t('Message')}
                            onChange={this.inputUpdate}
                        />
                        <CardActions>
                            <RaisedButton
                                primary
                                disabled={disabled}
                                label={i18n.t('Send')}
                                onClick={() => this.sendMessage()}
                            />
                            <FlatButton
                                label={i18n.t('Discard')}
                                disabled={disabled}
                                onClick={() => {
                                    this.props.displaySnackMessage(
                                        i18n.t('Message discarded'),
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
