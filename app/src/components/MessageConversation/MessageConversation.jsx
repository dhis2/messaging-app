import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import history from 'utils/history'
import * as actions from 'constants/actions'

import { getInstance as getD2Instance } from 'd2/lib/d2'

import Subheader from 'material-ui/Subheader/Subheader'
import AddIcon from 'material-ui-icons/Add'
import NavigationBack from 'material-ui-icons/ArrowBack'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Chip from 'material-ui/Chip'

import Paper from 'material-ui/Paper'

import i18n from 'd2-i18n'

import Message from 'components/MessageConversation/Message'
import ReplyCard from 'components/MessageConversation/ReplyCard'
import SuggestionField from 'components/Common/SuggestionField'
import ExtendedChoiceLabel from 'components/Common/ExtendedChoiceLabel'
import { styles } from 'styles/messageConversationStyles'

import theme from 'styles/theme'

const NOTIFICATIONS = ['TICKET', 'VALIDATION_RESULT']
const maxParticipantsDisplay = 30

class MessageConversation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recipients: [],
            currentUser: undefined,
            cursor: 'auto',
        }
    }

    componentDidMount() {
        getD2Instance().then(instance => {
            this.setState({
                currentUser: instance.currentUser,
            })
        })
    }

    addRecipients = () => {
        const users = this.state.recipients.filter(r => r.type === 'user')
        const userGroups = this.state.recipients.filter(
            r => r.type === 'userGroup'
        )
        const organisationUnits = this.state.recipients.filter(
            r => r.type === 'organisationUnit'
        )
        this.props.addRecipients(
            users,
            userGroups,
            organisationUnits,
            this.props.messageConversation,
            this.props.selectedMessageType
        )

        this.setState({
            recipients: [],
        })
    }

    updateRecipients = recipients => {
        this.setState({
            recipients,
        })
    }

    render() {
        const messageConversation = this.props.messageConversation

        const messages = messageConversation.messages
        const notification = !!(
            NOTIFICATIONS.indexOf(messageConversation.messageType) + 1
        )
        const gridArea = this.props.wideview
            ? '2 / 2 / span 1 / span 9'
            : '2 / 4 / span 1 / span 7'

        const participants = messageConversation.userMessages
            .slice(0, maxParticipantsDisplay)
            .map(
                userMessage =>
                    typeof this.state.currentUser === 'undefined' ||
                    this.state.recipientsExpanded ||
                    this.state.currentUser.id !== userMessage.user.id
                        ? userMessage.user.displayName
                        : i18n.t('me')
            )

        const userMessagesLength = messageConversation.userMessages.length

        if (userMessagesLength > maxParticipantsDisplay) {
            participants.push(
                ' + '.concat(userMessagesLength - maxParticipantsDisplay)
            )
        }

        return (
            <div id="messageconversation" style={styles.canvas(gridArea)}>
                <div style={styles.innerCanvas}>
                    <IconButton
                        style={styles.iconButton}
                        tooltipPosition="bottom-right"
                        onClick={() =>
                            history.push(`/${messageConversation.messageType}`)
                        }
                        tooltip={i18n.t('Show all messages')}
                    >
                        <NavigationBack />
                    </IconButton>
                    <Subheader style={styles.subjectSubheader}>
                        {messageConversation.subject}
                    </Subheader>
                    <div style={styles.participantsCanvas}>
                        <Subheader
                            style={{
                                paddingLeft: '12px',
                                paddingTop: '10px',
                            }}
                        >
                            {i18n.t('Participants')}
                        </Subheader>
                        <div style={styles.participants}>
                            {participants.map(participant => (
                                <Chip key={participant} style={styles.chip}>
                                    {participant}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <SuggestionField
                        style={styles.participantsSuggestionField(
                            this.props.wideview
                        )}
                        label={i18n.t('Add participants to conversation')}
                        messageConversation={messageConversation}
                        recipients={this.state.recipients}
                        updateRecipients={this.updateRecipients}
                        limitSearchArray={messageConversation.userMessages}
                    />
                    <div style={styles.participantsAdd(this.props.wideview)}>
                        <FlatButton
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
                    {notification && (
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
                <div style={styles.messagesCanvas}>
                    <Paper style={styles.messagesInnerCanvas}>
                        {messages.map((message, i) => (
                            <Message
                                key={message.id}
                                displayTimeDiff={this.props.displayTimeDiff}
                                message={message}
                                messageConversation={messageConversation}
                                notification={notification}
                                currentUser={this.state.currentUser}
                                lastMessage={i + 1 === messages.length}
                                downloadAttachment={attachment =>
                                    this.props.downloadAttachment(
                                        messageConversation.id,
                                        message.id,
                                        attachment.id
                                    )
                                }
                                cancelAttachment={this.props.cancelAttachment}
                            />
                        ))}
                    </Paper>
                    <ReplyCard
                        {...this.props}
                        messageConversation={messageConversation}
                        gridArea={'2 / 1 / span 1 / span 2'}
                    />
                </div>
            </div>
        )
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
                messageType
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
            downloadAttachment: (
                messageConversationId,
                messageId,
                attachmentId
            ) =>
                dispatch({
                    type: actions.DOWNLOAD_ATTACHMENT,
                    payload: { messageConversationId, messageId, attachmentId },
                }),
            cancelAttachment: attachmentName =>
                dispatch({
                    type: actions.CANCEL_ATTACHMENT,
                    payload: { attachmentName },
                }),
        }),
        null,
        { pure: false }
    )
)(MessageConversation)
