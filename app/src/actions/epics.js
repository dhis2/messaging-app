import * as actions from 'constants/actions'

import log from 'loglevel'

import * as api from 'api/api'

const moment = require('moment')

// Simple hack to solve negative time difference
const FUTURE_HACK = 5000

const createAction = (type, payload) => ({ type, payload })

export const setDisplayTimeDiff = () => async dispatch => {
    try {
        const serverDate = await api.getServerDate()
        const displayTimeDiff = moment().diff(moment(serverDate)) - FUTURE_HACK
        dispatch(
            createAction(actions.SET_DISPLAY_TIME_DIFF_SUCCESS, displayTimeDiff)
        )
    } catch (error) {
        dispatch(createAction(actions.SET_DISPLAY_TIME_DIFF_ERROR, { error }))
    }
}

export const setSelectedMessageConversation = messageConversation => async dispatch => {
    dispatch(createAction(actions.SET_SELECTED_MESSAGE_CONVERSATION, null))
    try {
        const result = await api.getMessageConversation(messageConversation)
        dispatch(
            createAction(actions.SET_SELECTED_MESSAGE_CONVERSATION_SUCCESS, {
                messageConversation: result,
            })
        )
    } catch (error) {
        dispatch(
            createAction(actions.SET_SELECTED_MESSAGE_CONVERSATION_ERROR, {
                error,
            })
        )
    }
}

export const updateMessageConversations = (
    messageConversationIds,
    identifier,
    value,
    messageType,
    selectedMessageConversation
) => async dispatch => {
    if (identifier === 'FOLLOW_UP') {
        try {
            await api.updateMessageConversationFollowup(
                messageConversationIds,
                value
            )
            dispatch(
                createAction(actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS, {
                    messageType: messageType,
                    page: 1,
                    identifier: identifier,
                })
            )
            dispatch(loadMessageConversations())
            dispatch(setSelectedMessageConversation())
        } catch (error) {
            dispatch(
                createAction(actions.MESSAGE_CONVERSATION_UPDATE_ERROR, {
                    error,
                })
            )
        }
    } else {
        const promises = messageConversationIds.map(messageConversationId => {
            let promise
            switch (identifier) {
                case 'STATUS':
                    promise = api.updateMessageConversationStatus(
                        messageConversationId,
                        value
                    )
                    break
                case 'PRIORITY':
                    promise = api.updateMessageConversationPriority(
                        messageConversationId,
                        value
                    )
                    break
                case 'ASSIGNEE':
                    if (
                        value !== undefined &&
                        messageType.id === 'VALIDATION_RESULT'
                    ) {
                        promise = api
                            .addRecipients(
                                value.map(value => ({
                                    id: value,
                                })),
                                [],
                                [],
                                messageConversationId
                            )
                            .then(() =>
                                api.updateMessageConversationAssignee(
                                    messageConversationId,
                                    value
                                )
                            )
                    } else {
                        promise = api.updateMessageConversationAssignee(
                            messageConversationId,
                            value
                        )
                    }

                    break
                default:
                    log.error(
                        'Unexpected identifier for updateMessageConversations'
                    )
                    break
            }
            return promise
        })

        try {
            await Promise.all(promises)
            dispatch(
                createAction(actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS, {
                    messageType: messageType,
                    page: 1,
                    identifier: identifier,
                })
            )
            dispatch(loadMessageConversations())
            dispatch(setSelectedMessageConversation())
        } catch (error) {
            dispatch(
                createAction(actions.MESSAGE_CONVERSATION_UPDATE_ERROR, {
                    error,
                })
            )
        }
    }

    if (selectedMessageConversation) {
        dispatch(
            createAction(actions.SET_SELECTED_MESSAGE_CONVERSATION, {
                messageConversation: selectedMessageConversation,
            })
        )
    }
}

export const loadMessageConversations = (
    messageType,
    selectedMessageType,
    loadMore = false
) => async (dispatch, getState) => {
    dispatch(
        createAction(actions.LOAD_MESSAGE_CONVERSATIONS, {
            messageType,
            loadMore,
        })
    )

    const promises = []
    const state = getState()

    // Default fallback values so this action can be called without arguments
    messageType = messageType || state.messaging.selectedMessageType
    selectedMessageType =
        selectedMessageType || state.messaging.selectedMessageType.id

    try {
        for (let i = 1; i <= messageType.page; i++) {
            const promise = api
                .getMessageConversations(
                    messageType.id,
                    i,
                    state.messaging.messageFilter,
                    state.messaging.statusFilter,
                    state.messaging.priorityFilter,
                    state.messaging.assignedToMeFilter,
                    state.messaging.markedForFollowUpFilter,
                    state.messaging.unreadFilter
                )
                .then(result => ({
                    messageConversations: result.messageConversations,
                    pager: result.pager,
                }))

            promises.push(promise)
        }

        const result = await Promise.all(promises)
        const nrOfUnread = await api.getNrOfUnread(messageType.id)

        const messageConversations = result.reduce(
            (accumulated, r) => accumulated.concat(r.messageConversations),
            []
        )

        dispatch(
            createAction(actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS, {
                messageConversations,
                pager: result[result.length - 1].pager,
                messageType: messageType,
                selectedMessageType: selectedMessageType,
                nrOfUnread,
            })
        )
    } catch (error) {
        dispatch(
            createAction(actions.MESSAGE_CONVERSATIONS_LOAD_ERROR, { error })
        )
    }
}

export const deleteMessageConversations = (
    messageConversationIds,
    messageType
) => async dispatch => {
    try {
        const promises = messageConversationIds.map(messageConversationId =>
            api.deleteMessageConversation(messageConversationId)
        )
        await Promise.all(promises)
        dispatch(
            createAction(actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS, {
                messageType: messageType,
                page: 1,
            })
        )
        dispatch(loadMessageConversations())
    } catch (error) {
        dispatch(
            createAction(actions.MESSAGE_CONVERSATIONS_DELETE_ERROR, { error })
        )
    }
}

export const sendMessage = (
    users,
    userGroups,
    organisationUnits,
    messageConversationId,
    messageType
) => async (dispatch, getState) => {
    try {
        const state = getState()
        await api.sendMessage(
            state.messaging.subject,
            users,
            userGroups,
            organisationUnits,
            state.messaging.input,
            state.messaging.attachments,
            messageConversationId
        )
        dispatch(
            createAction(actions.SEND_MESSAGE_SUCCESS, { messageType, page: 1 })
        )
        dispatch(loadMessageConversations())
    } catch (error) {
        dispatch(createAction(actions.SEND_MESSAGE_ERROR, { error }))
    }
}

export const sendFeedbackMessage = messageType => async (
    dispatch,
    getState
) => {
    const state = getState()
    try {
        await api.sendFeedbackMessage(
            state.messaging.subject,
            state.messaging.input
        )
        dispatch(
            createAction(actions.SEND_MESSAGE_SUCCESS, {
                messageType: messageType,
                page: 1,
            })
        )
        dispatch(loadMessageConversations())
    } catch (error) {
        dispatch(createAction(actions.SEND_MESSAGE_ERROR, { error }))
    }
}

export const replyMessage = (
    message,
    internalReply,
    messageConversation,
    messageType
) => async (dispatch, getState) => {
    const state = getState()
    try {
        await api.replyMessage(
            message,
            internalReply,
            state.messaging.attachments.map(attachment => attachment.id),
            messageConversation.id
        )
        dispatch(
            createAction(actions.REPLY_MESSAGE_SUCCESS, {
                messageConversation: messageConversation,
                messageType: messageType,
                page: 1,
            })
        )
        dispatch(loadMessageConversations())
        dispatch(setSelectedMessageConversation())
    } catch (error) {
        dispatch(createAction(actions.REPLY_MESSAGE_ERROR, { error }))
    }
}

export const markMessageConversations = (
    mode,
    markedConversations,
    messageType
) => async dispatch => {
    try {
        await (mode === 'read'
            ? api.markRead(markedConversations)
            : api.markUnread(markedConversations))
        dispatch(
            createAction(actions.MARK_MESSAGE_CONVERSATIONS_SUCCESS, {
                messageType: messageType,
                page: 1,
            })
        )
        dispatch(loadMessageConversations())
    } catch (error) {
        dispatch(
            createAction(actions.MARK_MESSAGE_CONVERSATIONS_ERROR, { error })
        )
    }
}

export const addRecipients = (
    users,
    userGroups,
    organisationUnits,
    messageConversation,
    messageType
) => async dispatch => {
    try {
        await api.addRecipients(
            users,
            userGroups,
            organisationUnits,
            messageConversation.id
        )
        dispatch(
            createAction(actions.ADD_RECIPIENTS_SUCCESS, {
                messageConversation: messageConversation,
                messageType: messageType,
                page: 1,
            })
        )
        dispatch(setSelectedMessageConversation())
    } catch (error) {
        dispatch(createAction(actions.ADD_RECIPIENTS_ERROR, { error }))
    }
}

export const addAttachment = attachment => async dispatch => {
    dispatch(createAction(actions.ADD_ATTACHMENT, attachment))

    try {
        const result = await api.addAttachment(attachment)
        dispatch(
            createAction(actions.ADD_ATTACHMENT_SUCCESS, {
                id: result.response.fileResource.id,
                name: attachment.name,
                contentLength: result.response.fileResource.contentLength,
            })
        )
    } catch (error) {
        dispatch(createAction(actions.ADD_ATTACHMENT_ERROR, { error }))
    }
}

export const cancelAttachment = attachmentName =>
    createAction(actions.CANCEL_ATTACHMENT, { attachmentName })

export const downloadAttachment = (
    messageConversationId,
    messageId,
    attachmentId
) => async dispatch => {
    try {
        await api.downloadAttachment(
            messageConversationId,
            messageId,
            attachmentId
        )
        dispatch(createAction(actions.DOWNLOAD_ATTACHMENT_SUCCESS))
    } catch (error) {
        dispatch(createAction(actions.DOWNLOAD_ATTACHMENT_ERROR, { error }))
    }
}
