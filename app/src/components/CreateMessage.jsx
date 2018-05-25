import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import SuggestionField from './SuggestionField';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

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
            subject: '',
            subjectError: false,
            input: '',
            inputError: false,
            recipients: [],
            recipientError: false,
        };
    }

    subjectUpdate = (event, newValue) => {
        this.setState({ subject: newValue });
    };

    inputUpdate = (event, newValue) => {
        this.setState({ input: newValue });
    };

    sendMessage = () => {
        const error =
            this.state.input === '' ||
            this.state.subject === '' ||
            this.state.recipients.length === 0;
        this.setState({
            inputError: this.state.input === '',
            subjectError: this.state.subject === '',
            recipientError: this.state.recipients.length === 0,
        });
        if (!error) {
            const messageType = _.find(this.props.messageTypes, { id: 'PRIVATE' });
            const users = this.state.recipients.filter(r => r.type === 'user');
            const userGroups = this.state.recipients.filter(r => r.type === 'userGroup');
            const organisationUnits = this.state.recipients.filter(
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
        this.setState({ subject: '', input: '', recipients: [] });
    };

    updateRecipients = recipients => {
        this.setState({
            recipients,
        });
    };

    render() {
        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 2'
            : '2 / 3 / span 1 / span 1';
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
                            messageConversation={this.props.messageConversation}
                            recipients={this.state.recipients}
                            updateRecipients={this.updateRecipients}
                            errorText={this.state.recipientError ? 'This field is required' : ''}
                        />
                        <TextField
                            floatingLabelText="Subject"
                            fullWidth
                            value={this.state.subject}
                            errorText={this.state.subjectError ? 'This field is required' : ''}
                            onChange={this.subjectUpdate}
                        />
                        <TextField
                            key={'createMessage'}
                            id={'createMessage'}
                            rows={5}
                            underlineShow={false}
                            value={this.state.input}
                            multiLine
                            fullWidth
                            floatingLabelText="Message"
                            errorText={this.state.inputError ? 'This field is required' : ''}
                            onChange={this.inputUpdate}
                        />
                        <CardActions>
                            <FlatButton label="Send" onClick={() => this.sendMessage()} />
                            <FlatButton label="Discard" onClick={() => history.push('/PRIVATE')} />
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
            displaySnackMessage: (message, snackType) =>
                dispatch({ type: actions.DISPLAY_SNACK_MESSAGE, payload: { message, snackType } }),
        }),
    ),
    pure,
)(CreateMessage);
