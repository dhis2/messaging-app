import i18n from '@dhis2/d2-i18n'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader/Subheader'
import AddIcon from 'material-ui-icons/Add'
import NavigationBack from 'material-ui-icons/ArrowBack'
import propTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    addRecipients,
    downloadAttachment,
    cancelAttachment,
    clearSelectedMessageConversation,
} from '../../actions/index.js'
import { styles } from '../../styles/messageConversationStyles.js'
import theme from '../../styles/theme.js'
import { supportsAttachments } from '../../utils/helpers.js'
import history from '../../utils/history.js'
import ExtendedChoiceLabel from '../Common/ExtendedChoiceLabel.js'
import SuggestionField from '../Common/SuggestionField.js'
import Message from './Message.js'
import ReplyCard from './ReplyCard.js'

const NOTIFICATIONS = ['TICKET', 'VALIDATION_RESULT']
const maxParticipantsDisplay = 30

class MessageConversation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recipients: [],
            cursor: 'auto',
        }
    }

    backToList = () => {
        const { clearSelectedMessageConversation, messageConversation } =
            this.props
        history.push(`/${messageConversation.messageType}`)
        clearSelectedMessageConversation()
    }

    addRecipients = () => {
        const users = this.state.recipients.filter((r) => r.type === 'user')
        const userGroups = this.state.recipients.filter(
            (r) => r.type === 'userGroup'
        )
        const organisationUnits = this.state.recipients.filter(
            (r) => r.type === 'organisationUnit'
        )
        const { messageConversation, selectedMessageType: messageType } =
            this.props

        this.props.addRecipients({
            users,
            userGroups,
            organisationUnits,
            messageConversation,
            messageType,
        })

        this.setState({
            recipients: [],
        })
    }

    updateRecipients = (recipients) => {
        this.setState({
            recipients,
        })
    }

    render() {
        const { messageConversation, currentUser } = this.props
        const messages = messageConversation.messages
        const notification = !!(
            NOTIFICATIONS.indexOf(messageConversation.messageType) + 1
        )
        const participants = messageConversation.userMessages
            .slice(0, maxParticipantsDisplay)
            .map((userMessage) =>
                !currentUser.id ||
                this.state.recipientsExpanded ||
                currentUser.id !== userMessage.user.id
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
                            {participants.map((participant) => (
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
                                downloadAttachment={(attachment) =>
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

MessageConversation.propTypes = {
    addRecipients: propTypes.func,
    cancelAttachment: propTypes.func,
    clearSelectedMessageConversation: propTypes.func,
    currentUser: propTypes.object,
    displayExtendedChoices: propTypes.bool,
    displayTimeDiff: propTypes.number,
    downloadAttachment: propTypes.func,
    enableAttachments: propTypes.bool,
    messageConversation: propTypes.object,
    selectedMessageType: propTypes.object,
}

const mapStateToProps = (state) => ({
    currentUser: state.messaging.currentUser,
    selectedMessageType: state.messaging.selectedMessageType,
    displayTimeDiff: state.messaging.displayTimeDiff,
    enableAttachments: supportsAttachments(state.messaging.dhis2CoreVersion),
})

export default connect(mapStateToProps, {
    addRecipients,
    downloadAttachment,
    cancelAttachment,
    clearSelectedMessageConversation,
})(MessageConversation)
