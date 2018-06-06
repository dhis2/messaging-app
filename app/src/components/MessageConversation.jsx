import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';

import history from 'utils/history';
import * as actions from 'constants/actions';
import * as api from 'api/api';

import { getInstance as getD2Instance } from 'd2/lib/d2';

import Subheader from 'material-ui/Subheader/Subheader';
import AddIcon from 'material-ui-icons/Add';
import NavigationBack from 'material-ui-icons/ArrowBack';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import Paper from 'material-ui/Paper';
import ExpandMore from 'material-ui-icons/ExpandMore';
import ExpandLess from 'material-ui-icons/ExpandLess';

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
            recipientsExpanded: false,
            currentUser: undefined,
            cursor: 'auto',
        };
    }

    addRecipients = () => {
        const users = this.state.recipients.filter(r => r.type == 'user');
        const userGroups = this.state.recipients.filter(r => r.type == 'userGroup');
        const organisationUnits = this.state.recipients.filter(r => r.type == 'organisationUnit');
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

    componentWillMount() {
        getD2Instance().then(instance => {
            this.setState({
                currentUser: instance.currentUser,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.messageConversation.id != nextProps.messageConversation.id &&
            nextProps.messageConversation != undefined
        ) {
            this.setState({
                recipientsExpanded: false,
            });
        }
    }

    onMouseEnter = () => this.setState({ cursor: 'pointer' });
    onMouseLeave = () => this.setState({ cursor: 'auto' });

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

        let participants = messageConversation.userMessages
            .slice(0, maxParticipantsDisplay)
            .map(
                userMessage =>
                    this.state.currentUser == undefined ||
                    this.state.recipientsExpanded ||
                    this.state.currentUser.id != userMessage.user.id
                        ? userMessage.user.displayName
                        : 'me',
            )
            .join(', ');

        const userMessagesLength = messageConversation.userMessages.length;

        if (userMessagesLength > maxParticipantsDisplay) {
            participants = participants.concat(
                ' (+ '.concat(userMessagesLength - maxParticipantsDisplay).concat(')'),
            );
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
                        tooltip={'Show all messages'}
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

                    {this.state.recipientsExpanded && (
                        <SuggestionField
                            style={{ gridArea: '2 / 1 / span 1 / span 5' }}
                            label={'Add recipients to conversation'}
                            messageConversation={messageConversation}
                            recipients={this.state.recipients}
                            updateRecipients={this.updateRecipients}
                        />
                    )}
                    {this.state.recipientsExpanded && (
                        <FlatButton
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignSelf: 'center',
                                gridArea: '2 / 6',
                                width: '100px',
                            }}
                            icon={<AddIcon />}
                            onClick={() => this.addRecipients()}
                            label={'Add'}
                        />
                    )}

                    <div
                        style={{
                            gridArea: this.state.recipientsExpanded
                                ? '3 / 1 / span 1 / span 6'
                                : '2 / 1 / span 1 / span 6',
                            display: 'grid',
                            gridTemplateColumns: '100% 48px',
                        }}
                    >
                        <Subheader
                            style={{
                                fontSize: '14px',
                                paddingLeft: '0px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                gridArea: '1 / 1',
                                whiteSpace: this.state.recipientsExpanded ? '' : 'nowrap',
                                cursor: this.state.cursor,
                            }}
                            onClick={() => {
                                this.setState({
                                    recipientsExpanded: !this.state.recipientsExpanded,
                                });
                            }}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            {'Participants: '.concat(participants)}
                        </Subheader>
                        <IconButton
                            style={{
                                marginTop: '0px',
                                padding: '0px',
                                alignSelf: 'right',
                                gridArea: '1 / 2',
                            }}
                            tooltip={!this.state.recipientsExpanded ? 'Expand' : 'Hide'}
                            tooltipPosition="bottom-left"
                        >
                            {!this.state.recipientsExpanded ? (
                                <ExpandMore
                                    onClick={() =>
                                        this.setState({
                                            recipientsExpanded: !this.state.recipientsExpanded,
                                        })
                                    }
                                />
                            ) : (
                                <ExpandLess
                                    onClick={() =>
                                        this.setState({
                                            recipientsExpanded: !this.state.recipientsExpanded,
                                        })
                                    }
                                />
                            )}
                        </IconButton>
                    </div>

                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 8'}
                            title={'Status'}
                            label={messageConversation.status}
                        />
                    )}
                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 9'}
                            title={'Priority'}
                            label={messageConversation.priority}
                        />
                    )}
                    {this.props.displayExtendedChoices && (
                        <ExtendedChoiceLabel
                            color={theme.palette.darkGray}
                            showTitle
                            gridArea={'1 / 10'}
                            title={'Assignee'}
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
        state => {
            return {
                selectedMessageType: state.messaging.selectedMessageType,
            };
        },
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
            setSelectedMessageConversation: messageConversation =>
                dispatch({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
                    payload: { messageConversation },
                }),
        }),
    ),
    pure,
)(MessageConversation);
