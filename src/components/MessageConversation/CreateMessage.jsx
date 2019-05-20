import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { generateUid } from 'd2/lib/uid'
import i18n from 'd2-i18n'
import { Card, CardActions, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Subheader from 'material-ui/Subheader/Subheader'
import RadioButton from 'material-ui/RadioButton'
import {
    sendMessage,
    sendFeedbackMessage,
    displaySnackMessage,
    updateInputFields,
    addAttachment,
    removeAttachment,
    cancelAttachment,
    addRecipientByUserId,
} from '../../actions'
import history from '../../utils/history'
import { supportsAttachments } from '../../utils/helpers'
import SuggestionField from '../Common/SuggestionField'
import AttachmentUploadButton from '../Attachments/AttachmentUploadButton'
import { NEGATIVE } from '../../constants/development'
import Attachments from '../Attachments/Attachments'
import { subheader } from '../../styles/style'

const styles = {
    canvas: {
        flex: '3 0',
        margin: '10px',
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: 'calc(100vh - 110px)',
    },
    messageTypeField: {
        display: 'flex',
        flexDirection: 'row',
    },
    messageType: { width: '300px', marginTop: '10px' },
}

class CreateMessage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMessageFeedback: false,
        }
    }

    componentDidMount() {
        const { addRecipientByUserId } = this.props
        const { messageId, recipientId } = this.props.match.params

        if (messageId === 'create' && recipientId) {
            addRecipientByUserId(recipientId)
        }
    }

    subjectUpdate = (event, newValue) => {
        this.props.updateInputFields(
            newValue,
            this.props.input,
            this.props.recipients
        )
    }

    inputUpdate = (event, newValue) => {
        this.props.updateInputFields(
            this.props.subject,
            newValue,
            this.props.recipients
        )
    }

    updateRecipients = recipients => {
        this.props.updateInputFields(
            this.props.subject,
            this.props.input,
            recipients
        )
    }

    sendMessage = () => {
        const messageTypeId = this.state.isMessageFeedback
            ? 'TICKET'
            : 'PRIVATE'
        const messageType = this.props.messageTypes.find(
            messageType => messageType.id === messageTypeId
        )

        if (this.state.isMessageFeedback) {
            this.props.sendFeedbackMessage(messageType)
            history.push('/TICKET')
        } else {
            const users = this.props.recipients.filter(r => r.type === 'user')
            const userGroups = this.props.recipients.filter(
                r => r.type === 'userGroup'
            )
            const organisationUnits = this.props.recipients.filter(
                r => r.type === 'organisationUnit'
            )
            const messageConversationId = generateUid()

            this.props.sendMessage({
                users,
                userGroups,
                organisationUnits,
                messageConversationId,
                messageType,
            })
            history.push('/PRIVATE')
        }
    }

    wipeInput = () => {
        this.props.updateInputFields('', '', [])
        this.props.attachments.length > 0 && this.props.clearAttachments()
    }

    handleDiscard = () => {
        const message = i18n.t('Message discarded')
        const snackType = NEGATIVE
        const onSnackActionClick = () => history.push('/PRIVATE/create')
        const onSnackRequestClose = () => this.wipeInput()

        this.props.displaySnackMessage({
            message,
            onSnackActionClick,
            onSnackRequestClose,
            snackType,
        })

        history.push('/PRIVATE')
    }

    render() {
        const disabled =
            this.props.subject === '' ||
            this.props.input === '' ||
            (!this.state.isMessageFeedback &&
                this.props.recipients.length === 0)

        const discardDisabled =
            this.props.subject === '' &&
            this.props.input === '' &&
            (!this.state.isMessageFeedback &&
                this.props.recipients.length === 0)

        return (
            <div style={styles.canvas}>
                <Subheader style={subheader}> {i18n.t('Create')}</Subheader>
                <Card>
                    <CardText>
                        <SuggestionField
                            style={{ margin: '0px' }}
                            label={i18n.t('To')}
                            disabled={this.state.isMessageFeedback}
                            recipients={
                                this.state.isMessageFeedback
                                    ? [
                                          {
                                              id: 'id',
                                              displayName: i18n.t(
                                                  'Feedback recipient group'
                                              ),
                                          },
                                      ]
                                    : this.props.recipients
                            }
                            updateRecipients={this.updateRecipients}
                            inputHeight={'100px'}
                        />
                        <div style={styles.messageTypeField}>
                            <div style={styles.messageType}>
                                <RadioButton
                                    label={i18n.t('Private message')}
                                    checked={!this.state.isMessageFeedback}
                                    onCheck={() => {
                                        this.setState({
                                            isMessageFeedback: !this.state
                                                .isMessageFeedback,
                                        })
                                    }}
                                />
                            </div>
                            <div style={styles.messageType}>
                                <RadioButton
                                    label={i18n.t('Feedback message')}
                                    checked={this.state.isMessageFeedback}
                                    onCheck={() => {
                                        this.setState({
                                            isMessageFeedback: !this.state
                                                .isMessageFeedback,
                                        })
                                    }}
                                />
                            </div>
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
                        {this.props.enableAttachments && (
                            <Attachments
                                dataDirection={'upload'}
                                attachments={this.props.attachments}
                                removeAttachment={attachment =>
                                    this.props.removeAttachment(attachment.id)
                                }
                                cancelAttachment={this.props.cancelAttachment}
                            />
                        )}
                        <CardActions style={{ paddingLeft: '0px' }}>
                            <RaisedButton
                                primary
                                disabled={disabled}
                                label={i18n.t('Send')}
                                onClick={() => this.sendMessage()}
                            />
                            <FlatButton
                                label={i18n.t('Discard')}
                                disabled={discardDisabled}
                                onClick={this.handleDiscard}
                            />
                            {this.props.enableAttachments && (
                                <AttachmentUploadButton
                                    addAttachment={attachment => {
                                        this.props.addAttachment(attachment)
                                    }}
                                />
                            )}
                        </CardActions>
                    </CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    messageTypes: state.messaging.messageTypes,
    subject: state.messaging.subject,
    input: state.messaging.input,
    recipients: state.messaging.recipients,
    attachments: state.messaging.attachments,
    enableAttachments: supportsAttachments(state.messaging.dhis2CoreVersion),
})

export default compose(
    connect(
        mapStateToProps,
        {
            sendMessage,
            sendFeedbackMessage,
            displaySnackMessage,
            updateInputFields,
            addAttachment,
            removeAttachment,
            cancelAttachment,
            addRecipientByUserId,
        },
        null,
        { pure: false }
    )
)(CreateMessage)
