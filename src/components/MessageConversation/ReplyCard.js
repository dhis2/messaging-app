import i18n from '@dhis2/d2-i18n'
import { Card, CardActions, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import propTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
    replyMessage,
    setSelectedMessageType,
    updateInputFields,
    displaySnackMessage,
    addAttachment,
    removeAttachment,
    cancelAttachment,
} from '../../actions/index.js'
import { NEGATIVE } from '../../constants/development.js'
import { supportsAttachments } from '../../utils/helpers.js'
import Attachments from '../Attachments/Attachments.js'
import AttachmentUploadButton from '../Attachments/AttachmentUploadButton.js'

class ReplyCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            discardState: false,
        }
    }

    componentWillUnmount() {
        this.wipeInput()
    }

    replyMessage = (internalReply) => {
        const {
            input: message,
            selectedMessageConversation: messageConversation,
            selectedMessageType: messageType,
        } = this.props

        this.props.replyMessage({
            message,
            internalReply,
            messageConversation,
            messageType,
        })

        this.wipeInput()
    }

    wipeInput = () => {
        this.props.updateInputFields('', '', [])
        this.props.attachments.length > 0 && this.props.clearAttachments()
        this.setState({
            inputError: false,
        })
    }

    texFieldUpdate = (event, newValue) => {
        this.props.updateInputFields('', newValue, [])
    }

    handleDiscard = () => {
        const message = i18n.t('Reply discarded')
        const snackType = NEGATIVE
        const onSnackActionClick = () => this.setState({ discardState: false })
        const onSnackRequestClose = () => {
            this.setState({ discardState: false })
            this.wipeInput()
        }

        this.setState({ discardState: true })
        this.props.displaySnackMessage({
            message,
            onSnackActionClick,
            onSnackRequestClose,
            snackType,
        })
        this.setState({
            expanded: false,
        })
    }

    render() {
        return (
            <Card style={{ marginTop: '5px' }} expanded>
                <CardText style={{ padding: '0px 0px 0px 16px' }}>
                    <TextField
                        key={this.props.messageConversation.id}
                        id={this.props.messageConversation.id}
                        rows={5}
                        underlineShow={false}
                        value={this.state.discardState ? '' : this.props.input}
                        multiLine
                        fullWidth
                        floatingLabelText={i18n.t('Message')}
                        onChange={this.texFieldUpdate}
                    />
                    {this.props.enableAttachments &&
                        !this.state.discardState && (
                            <Attachments
                                dataDirection={'upload'}
                                attachments={this.props.attachments}
                                removeAttachment={(attachment) =>
                                    this.props.removeAttachment(attachment.id)
                                }
                                cancelAttachment={this.props.cancelAttachment}
                            />
                        )}

                    <CardActions style={{ paddingLeft: '0px' }}>
                        <RaisedButton
                            primary
                            label={i18n.t('Reply')}
                            disabled={
                                this.props.input === '' ||
                                this.state.discardState
                            }
                            onClick={() => this.replyMessage(false)}
                        />
                        {this.props.isInFeedbackRecipientGroup &&
                            this.props.selectedMessageType.id === 'TICKET' && (
                                <FlatButton
                                    primary
                                    label={i18n.t('Internal reply')}
                                    disabled={
                                        this.props.input === '' ||
                                        this.state.discardState
                                    }
                                    onClick={() => this.replyMessage(true)}
                                />
                            )}
                        <FlatButton
                            label={i18n.t('Discard')}
                            disabled={
                                this.props.input === '' ||
                                this.state.discardState
                            }
                            onClick={this.handleDiscard}
                        />
                        {this.props.enableAttachments && (
                            <AttachmentUploadButton
                                addAttachment={(attachment) => {
                                    this.props.addAttachment(attachment)
                                }}
                            />
                        )}
                        )
                    </CardActions>
                </CardText>
            </Card>
        )
    }
}

ReplyCard.propTypes = {
    addAttachment: propTypes.func,
    attachments: propTypes.array,
    cancelAttachment: propTypes.func,
    clearAttachments: propTypes.func,
    displaySnackMessage: propTypes.func,
    enableAttachments: propTypes.bool,
    input: propTypes.string,
    isInFeedbackRecipientGroup: propTypes.bool,
    messageConversation: propTypes.object,
    removeAttachment: propTypes.func,
    replyMessage: propTypes.func,
    selectedMessageConversation: propTypes.object,
    selectedMessageType: propTypes.object,
    updateInputFields: propTypes.func,
}

const mapStateToProps = (state) => ({
    selectedMessageConversation: state.messaging.selectedMessageConversation,
    selectedMessageType: state.messaging.selectedMessageType,
    messageTypes: state.messaging.messageTypes,
    input: state.messaging.input,
    isInFeedbackRecipientGroup: state.messaging.isInFeedbackRecipientGroup,
    attachments: state.messaging.attachments,
    enableAttachments: supportsAttachments(state.messaging.dhis2CoreVersion),
})

export default compose(
    connect(
        mapStateToProps,
        {
            replyMessage,
            setSelectedMessageType,
            updateInputFields,
            displaySnackMessage,
            addAttachment,
            removeAttachment,
            cancelAttachment,
        },
        null,
        { pure: false }
    )
)(ReplyCard)
