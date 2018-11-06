import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Subheader from 'material-ui/Subheader/Subheader'
import Checkbox from 'material-ui/Checkbox'
import Paper from 'material-ui/Paper'
import Flag from 'material-ui-icons/Flag'

import i18n from 'd2-i18n'

import history from 'utils/history'
import * as actions from 'constants/actions'
import ExtendedChoiceLabel from 'components/Common/ExtendedChoiceLabel'
import theme from 'styles/theme'
import { fontFamily } from 'constants/development'

const moment = require('moment')

const styles = {
    container(backgroundColor, wideview, cursor) {
        return {
            backgroundColor,
            display: 'flex',
            transition: 'all 0.2s ease-in-out',
            cursor: cursor,
            boxSizing: 'border-box',
            position: 'relative',
            whiteSpace: 'nowrap',
            boxShadow: 'none',
            borderBottom: '1px solid #dfdfdf',
            flexWrap: wideview ? 'nowrap' : 'wrap',
        }
    },
    checkBox(wideview) {
        return {
            flex: '0 0 32px',
            display: 'flex',
            alignSelf: 'center',
            paddingLeft: wideview ? 12 : 6,
        }
    },
    flag: {
        color: theme.palette.followUp,
        marginRight: 4,
    },
    sender(wideview, fontWeight) {
        return {
            fontFamily,
            fontSize: '14px',
            flex: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            color: 'black',
            paddingLeft: wideview ? 10 : 0,
            fontWeight,
        }
    },
    subject(wideview, fontColor, fontWeight) {
        return {
            flex: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingLeft: 10,
            fontFamily,
            color: fontColor,
            fontWeight,
            order: wideview ? 'inherit' : 10,
            marginTop: wideview ? 0 : -10,
            flexBasis: wideview ? '0%' : '100%',
        }
    },
    dateFormat(wideview, fontColor, fontWeight) {
        return {
            flex: 2,
            fontFamily,
            paddingLeft: wideview ? 10 : 0,
            paddingRight: wideview ? 0 : 10,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: wideview ? '' : 'end',
            color: fontColor,
            fontWeight,
        }
    },
}

class MessageConversationListItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            backgroundColor: theme.palette.canvasColor,
            cursor: 'auto',
        }
    }

    onClick = messageConversation => {
        this.props.setSelectedMessageConversation(messageConversation)
        if (messageConversation && !messageConversation.read) {
            this.props.markMessageConversations(
                'read',
                [messageConversation.id],
                this.props.selectedMessageType,
                this.props.messageFilter,
                this.props.statusFilter,
                this.props.priorityFilter
            )
        }
        this.props.updateInputFields('', '', [])
        this.props.attachments.length > 0 && this.props.clearAttachments()
        history.push(
            `/${messageConversation.messageType}/${messageConversation.id}`
        )
    }

    onMouseEnter = () =>
        this.setState({
            cursor: 'pointer',
            backgroundColor: theme.palette.accent2Color,
        })
    onMouseLeave = () =>
        this.setState({
            cursor: 'auto',
            backgroundColor: theme.palette.canvasColor,
        })

    getBackgroundColor = (messageConversation, checked) => {
        const selectedMessageConversation =
            this.props.selectedMessageConversation &&
            messageConversation.id === this.props.selectedMessageConversation.id

        if (checked && !selectedMessageConversation) {
            return theme.palette.blue50
        } else if (selectedMessageConversation) {
            return theme.palette.accent3Color
        }
        return this.state.backgroundColor
    }

    render() {
        const messageConversation = this.props.messageConversation
        const title = messageConversation.lastSender
            ? messageConversation.lastSender.displayName
            : this.props.selectedMessageType.displayName
        const checked = !!this.props.checkedIds.find(
            x => x.id === messageConversation.id
        )

        const displayExtendedChoices = this.props.displayExtendedChoices

        const displayTimeDiff = this.props.displayTimeDiff

        const today = moment()
        const messageDate = moment(messageConversation.lastMessage).add(
            displayTimeDiff
        )
        const fontWeight = !messageConversation.read ? 'bold' : ''
        const fontColor = this.props.messageConversation.read
            ? 'black'
            : theme.palette.darkGray

        const containerBackgroundColor = this.getBackgroundColor(
            messageConversation,
            checked
        )

        return (
            <Paper
                style={styles.container(
                    containerBackgroundColor,
                    this.props.wideview,
                    this.state.cursor
                )}
                onClick={event => {
                    const onClick =
                        event.target.innerText !== undefined &&
                        event.target.innerText !== ''

                    if (
                        onClick &&
                        !this.props.settingSelectedMessageConversation
                    ) {
                        this.onClick(messageConversation)
                        this.props.checkedIds.length > 0 &&
                            this.props.clearCheckedIds()
                        if (
                            this.props.wideview &&
                            (this.props.messageFilter !== undefined ||
                                this.props.priorityFilter !== undefined ||
                                this.props.statusFilter !== undefined)
                        ) {
                            this.props.setFilter(undefined, 'MESSAGE')
                        }
                    }
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <Checkbox
                    checked={checked}
                    style={styles.checkBox(this.props.wideview)}
                    onCheck={(event, isInputChecked) => {
                        this.props.setChecked(messageConversation, !checked)
                    }}
                />
                <div style={styles.sender(this.props.wideview, fontWeight)}>
                    {messageConversation.followUp && (
                        <Flag style={styles.flag} />
                    )}
                    <span>{title}</span>
                </div>
                <Subheader
                    style={styles.subject(
                        this.props.wideview,
                        fontColor,
                        fontWeight
                    )}
                >
                    {messageConversation.subject}
                </Subheader>
                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        title={i18n.t('Status')}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.status}
                    />
                )}
                {displayExtendedChoices && (
                    <ExtendedChoiceLabel
                        showTitle={false}
                        title={i18n.t('Priority')}
                        color={fontColor}
                        fontWeight={fontWeight}
                        label={messageConversation.priority}
                    />
                )}
                {this.props.notification &&
                    this.props.wideview && (
                        <ExtendedChoiceLabel
                            showTitle={false}
                            title={i18n.t('Assignee')}
                            color={fontColor}
                            fontWeight={fontWeight}
                            label={
                                messageConversation.assignee
                                    ? messageConversation.assignee.displayName
                                    : undefined
                            }
                        />
                    )}
                <Subheader
                    style={styles.dateFormat(
                        this.props.wideview,
                        fontColor,
                        fontWeight
                    )}
                >
                    {today.diff(messageDate, 'hours') < 72
                        ? messageDate.from(today)
                        : today.year() === messageDate.year()
                            ? messageDate.format('MMM DD')
                            : messageDate.format('ll')}
                </Subheader>
            </Paper>
        )
    }
}

export default compose(
    connect(
        state => ({
            selectedMessageConversation:
                state.messaging.selectedMessageConversation,
            settingSelectedMessageConversation:
                state.messaging.settingSelectedMessageConversation,
            selectedMessageType: state.messaging.selectedMessageType,
            checkedIds: state.messaging.checkedIds,
            displayTimeDiff: state.messaging.displayTimeDiff,
            messageFilter: state.messaging.messageFilter,
            statusFilter: state.messaging.statusFilter,
            priorityFilter: state.messaging.priorityFilter,
            attachments: state.messaging.attachments,
        }),
        dispatch => ({
            setChecked: (messageConversation, selectedValue) =>
                dispatch({
                    type: actions.SET_CHECKED,
                    payload: { messageConversation, selectedValue },
                }),
            setSelectedMessageConversation: messageConversation =>
                dispatch({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
                    payload: { messageConversation },
                }),
            markMessageConversations: (
                mode,
                markedConversations,
                messageType,
                messageFilter,
                statusFilter,
                priorityFilter
            ) =>
                dispatch({
                    type: actions.MARK_MESSAGE_CONVERSATIONS,
                    payload: {
                        mode,
                        markedConversations,
                        messageType,
                        messageFilter,
                        statusFilter,
                        priorityFilter,
                    },
                }),
            clearCheckedIds: () => dispatch({ type: actions.CLEAR_CHECKED }),
            setFilter: (filter, filterType) =>
                dispatch({
                    type: actions.SET_FILTER,
                    payload: { filter, filterType },
                }),
            updateInputFields: (subject, input, recipients) =>
                dispatch({
                    type: actions.UPDATE_INPUT_FIELDS,
                    payload: { subject, input, recipients },
                }),
            clearAttachments: () =>
                dispatch({ type: actions.CLEAR_ATTACHMENTS }),
        }),
        null,
        { pure: false }
    )
)(MessageConversationListItem)
