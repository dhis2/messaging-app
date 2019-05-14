import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { Card, CardActions, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import AttachmentField from '../Attachments/AttachmentField'
import Attachments from '../Attachments/Attachments'
import { supportsAttachments } from '../../utils/helpers'

import i18n from 'd2-i18n'

import {
    replyMessage,
    setSelectedMessageType,
    updateInputFields,
    displaySnackMessage,
    addAttachment,
    removeAttachment,
    cancelAttachment,
} from '../../actions'

import { NEGATIVE } from '../../constants/development'

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

    replyMessage = internalReply => {
        this.props.replyMessage(
            this.props.input,
            internalReply,
            this.props.selectedMessageConversation,
            this.props.selectedMessageType
        )
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
                                removeAttachment={attachment =>
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
                            onClick={() => {
                                this.setState({ discardState: true })
                                this.props.displaySnackMessage(
                                    i18n.t('Reply discarded'),
                                    () =>
                                        this.setState({ discardState: false }),
                                    () => {
                                        this.setState({ discardState: false })
                                        this.wipeInput()
                                    },
                                    NEGATIVE
                                )
                                this.setState({
                                    expanded: false,
                                })
                            }}
                        />
                        {this.props.enableAttachments && (
                            <AttachmentField
                                addAttachment={attachment => {
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

const mapStateToProps = state => ({
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
