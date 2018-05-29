import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';

import { getInstance as getD2Instance } from 'd2/lib/d2';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import AddIcon from 'material-ui-icons/Add';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import ExpandMore from 'material-ui-icons/ExpandMore';
import ExpandLess from 'material-ui-icons/ExpandLess';

import Message from './Message';
import ReplyCard from './ReplyCard';
import CustomFontIcon from './CustomFontIcon';
import CustomDropDown from './CustomDropDown';
import SuggestionField from './SuggestionField';
import ExtendedInformation from './ExtendedInformation';

import {
    messageConversationContainer,
    messagePanelContainer,
    subheader,
    subheader_minilist,
} from '../styles/style';
import theme from '../styles/theme';
import history from 'utils/history';
import * as actions from 'constants/actions';
import * as api from 'api/api';

const NOTIFICATIONS = ['SYSTEM', 'VALIDATION_RESULT'];
const maxParticipantsDisplay = 30;

class MessageConversation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipients: [],
            recipientsExpanded: false,
            currentUser: undefined,
        };
    }

    updateRecipients = recipients => {
        this.setState({
            recipients: recipients,
        });
    };

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

    render() {
        const messageConversation = this.props.messageConversation;

        const messages = messageConversation.messages;
        const displayExtendedInfo =
            (messageConversation.messageType == 'TICKET' ||
                messageConversation.messageType == '') &&
            this.props.wideview;
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
                ' (+ ' + (userMessagesLength - maxParticipantsDisplay) + ')',
            );
        }

        return (
            <div
                id="messageconversation"
                style={{
                    gridArea: gridArea,
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
                        gridTemplateRows: '50% 30% 20%',
                    }}
                >
                    <Subheader
                        style={{
                            ...subheader,
                            paddingLeft: '0px',
                            display: 'flex',
                            alignSelf: 'center',
                            gridArea: '1 / 1 / span 1 / span 7',
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

                    <Subheader
                        style={{
                            fontSize: '14px',
                            paddingLeft: '0px',
                            gridArea: this.state.recipientsExpanded
                                ? '3 / 1 / span 1 / span 6'
                                : '2 / 1 / span 1 / span 6',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: this.state.recipientsExpanded ? '' : 'nowrap',
                        }}
                    >
                        {'Participants: ' + participants}
                    </Subheader>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gridArea: '2 / 7',
                        }}
                    >
                        <IconButton
                            style={{
                                marginTop: '0px',
                                padding: '0px',
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
                        <ExtendedInformation
                            messageConversation={messageConversation}
                            gridArea={'1 / 8 / span 2 / span 3'}
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
