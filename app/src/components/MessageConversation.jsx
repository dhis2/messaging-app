import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import history from 'utils/history';
import * as actions from 'constants/actions';

import { getInstance as getD2Instance } from 'd2/lib/d2';

import Subheader from 'material-ui/Subheader/Subheader';
import AddIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';

import Paper from 'material-ui/Paper';

import i18n from 'd2-i18n';

import Message from './Message';
import ReplyCard from './ReplyCard';
import SuggestionField from './SuggestionField';
import ExtendedChoiceLabel from './ExtendedChoiceLabel';

import { subheader } from '../styles/style';
import theme from '../styles/theme';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT'];
const maxParticipantsDisplay = 30;

class MessageConversation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipients: [],
            currentUser: undefined,
            cursor: 'auto',
        };
    }

    componentWillMount() {
        getD2Instance().then(instance => {
            this.setState({
                currentUser: instance.currentUser,
            });
        });
    }

    addRecipients = () => {
        const users = this.state.recipients.filter(r => r.type === 'user');
        const userGroups = this.state.recipients.filter(r => r.type === 'userGroup');
        const organisationUnits = this.state.recipients.filter(r => r.type === 'organisationUnit');
        this.props.addRecipients(
            users,
            userGroups,
            organisationUnits,
            this.props.messageConversation,
            this.props.selectedMessageType,
        );

        this.setState({
            recipients: [],
        });
    };

    updateRecipients = recipients => {
        this.setState({
            recipients,
        });
    };

    render() {
        const messageConversation = this.props.messageConversation;

        const messages = messageConversation.messages;
        const notification = !!(NOTIFICATIONS.indexOf(messageConversation.messageType) + 1);
        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 9'
            : '2 / 4 / span 1 / span 7';

        const participants = messageConversation.userMessages
            .slice(0, maxParticipantsDisplay)
            .map(
                userMessage =>
                    this.state.currentUser == undefined ||
                    this.state.recipientsExpanded ||
                    this.state.currentUser.id != userMessage.user.id
                        ? userMessage.user.displayName
                        : i18n.t('me'),
            );

        const userMessagesLength = messageConversation.userMessages.length;

        if (userMessagesLength > maxParticipantsDisplay) {
            participants.push(' + '.concat(userMessagesLength - maxParticipantsDisplay));
        }

        return (
            <div
                id="messageconversation"
                style={{
                    gridArea,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    height: 'calc(100vh - 110px)',
                    paddingTop: '10px',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        margin: '0px 10px 0px 10px',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gridAutoFlow: 'column',
                        gridTemplateRows: '50% 30% 20%',
                    }}
                >
                    <IconButton
                        style={{
                            display: 'flex',
                            alignSelf: 'center',
                            gridArea: '1 / 1',
                        }}
                        tooltipPosition="bottom-right"
                        onClick={() => history.push(`/${messageConversation.messageType}`)}
                        tooltip={i18n.t('Show all messages')}
                    >
                        <NavigationBack />
                    </IconButton>
                    <Subheader
                        style={{
                            ...subheader,
                            display: 'flex',
                            alignSelf: 'center',
                            gridArea: '1 / 1 / span 1 / span 7',
                            width: 'calc(100% - 50px)',
                            marginLeft: '50px',
                        }}
                    >
                        {messageConversation.subject}
                    </Subheader>

                    <div
                        style={{
                            gridArea: '2 / 1 / span 1 / span 6',
                            display: 'grid',
                            gridTemplateRows: '10% 90%',
                        }}
                    >
                        <Subheader
                            style={{
                                paddingLeft: '12px',
                                paddingTop: '10px',
                                gridArea: '1 / 1',
                            }}
                        >
                            {i18n.t('Participants')}
                        </Subheader>
                        <div
                            style={{
                                paddingLeft: '12px',
                                paddingTop: '10px',
                                gridArea: '2 / 1',
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}
                        >
                            {participants.map(participant => (
                                <Chip key={participant} style={{ height: '32px' }}>
                                    {participant}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <SuggestionField
                        style={{
                            gridArea: '3 / 1 / span 1 / span 5',
                            paddingLeft: '12px',
                            marginBottom: '0px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}
                        label={i18n.t('Add participants to conversation')}
                        messageConversation={messageConversation}
                        recipients={this.state.recipients}
                        updateRecipients={this.updateRecipients}
                    />
                    <div style={{ alignSelf: 'end', marginBottom: '8px' }}>
                        <FlatButton
                            style={{
                                gridArea: '3 / 6',
                                marginLeft: '14px',
                            }}
                            icon={<AddIcon />}
                            onClick={() => this.addRecipients()}
                            label={i18n.t('Add')}
                        />
                    </div>
                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 8'}
                            title={i18n.t('Status')}
                            label={messageConversation.status}
                        />
                    )}
                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 9'}
                            title={i18n.t('Priority')}
                            label={messageConversation.priority}
                        />
                    )}
                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 10'}
                            title={i18n.t('Assignee')}
                            label={
                                messageConversation.assignee
                                    ? messageConversation.assignee.displayName
                                    : undefined
                            }
                        />
                    )}
                </div>
                <div
                    style={{
                        marginBottom: '50px',
                        display: 'grid',
                        backgroundColor: theme.palette.accent2Color,
                        gridTemplateColumns: '90% 10%',
                        gridTemplateRows: '90% 10%',
                        margin: '0px 10px 10px 10px',
                    }}
                >
                    <Paper
                        style={{
                            gridArea: '1 / 1 / span 1 / span 2',
                            padding: '0px',
                        }}
                    >
                        {messages.map((message, i) => (
                            <Message
                                key={message.id}
                                displayTimeDiff={this.props.displayTimeDiff}
                                message={message}
                                messageConversation={messageConversation}
                                notification={notification}
                                currentUser={this.state.currentUser}
                                lastMessage={i + 1 === messages.length}
                            />
                        ))}
                    </Paper>
                    {!notification && (
                        <ReplyCard
                            messageConversation={messageConversation}
                            gridArea={'2 / 1 / span 1 / span 2'}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default compose(
    connect(
        state => ({
            selectedMessageType: state.messaging.selectedMessageType,
            displayTimeDiff: state.messaging.displayTimeDiff,
        }),
        dispatch => ({
            addRecipients: (
                users,
                userGroups,
                organisationUnits,
                messageConversation,
                messageType,
            ) =>
                dispatch({
                    type: actions.ADD_RECIPIENTS,
                    payload: {
                        users,
                        userGroups,
                        organisationUnits,
                        messageConversation,
                        messageType,
                    },
                }),
        }),
    ),
    pure,
)(MessageConversation);
