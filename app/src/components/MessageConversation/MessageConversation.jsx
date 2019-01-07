import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import history from 'utils/history'
import {
    addRecipients,
    downloadAttachment,
    cancelAttachment,
    clearSelectedMessageConversation,
} from '../../actions'
import { supportsAttachments } from 'utils/helpers'

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

    backToList = () => {
        const {
            clearSelectedMessageConversation,
            messageConversation,
        } = this.props
        history.push(`/${messageConversation.messageType}`)
        clearSelectedMessageConversation()
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
            <div id="messageconversation" style={styles.canvas}>
                <div style={styles.innerCanvas}>
                    <div style={styles.header}>
                        <IconButton
                            style={styles.iconButton}
                            tooltipPosition="bottom-right"
                            onClick={this.backToList}
                            tooltip={i18n.t('Show all messages')}
                        >
                            <NavigationBack />
                        </IconButton>
                        <Subheader style={styles.subjectSubheader}>
                            {messageConversation.subject}
                        </Subheader>
                        {this.props.displayExtendedChoices && (
                            <ExtendedChoiceLabel
                                color={theme.palette.darkGray}
                                showTitle
                                title={i18n.t('Status')}
                                label={messageConversation.status}
                            />
                        )}
                        {this.props.displayExtendedChoices && (
                            <ExtendedChoiceLabel
                                color={theme.palette.darkGray}
                                showTitle
                                title={i18n.t('Priority')}
                                label={messageConversation.priority}
                            />
                        )}
                        {notification && (
                            <ExtendedChoiceLabel
                                color={theme.palette.darkGray}
                                showTitle
                                title={i18n.t('Assignee')}
                                label={
                                    messageConversation.assignee
                                        ? messageConversation.assignee
                                              .displayName
                                        : undefined
                                }
                            />
                        )}
                    </div>
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
                    <div style={styles.participantAddRow}>
                        <SuggestionField
                            style={styles.participantsSuggestionField}
                            label={i18n.t('Add participants to conversation')}
                            messageConversation={messageConversation}
                            recipients={this.state.recipients}
                            updateRecipients={this.updateRecipients}
                            limitSearchArray={messageConversation.userMessages}
                        />
                        <div style={styles.participantsAdd}>
                            <FlatButton
                                icon={<AddIcon />}
                                onClick={() => this.addRecipients()}
                                label={i18n.t('Add')}
                            />
                        </div>
                    </div>
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
                                enableAttachments={this.props.enableAttachments}
                            />
                        ))}
                    </Paper>
                    <ReplyCard
                        {...this.props}
                        messageConversation={messageConversation}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    selectedMessageType: state.messaging.selectedMessageType,
    displayTimeDiff: state.messaging.displayTimeDiff,
    enableAttachments: supportsAttachments(state.messaging.dhis2CoreVersion),
})

export default compose(
    connect(
        mapStateToProps,
        {
            addRecipients,
            downloadAttachment,
            cancelAttachment,
            clearSelectedMessageConversation,
        },
        null,
        { pure: false }
    )
)(MessageConversation)
