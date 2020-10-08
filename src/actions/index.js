import * as actions from '../constants/actions'
import log from 'loglevel'
import * as api from '../api/api'
import moment from 'moment'

// Simple hack to solve negative time difference
const FUTURE_HACK = 5000
const createAction = (type, payload) => ({ type, payload })

/******************
 * THUNKS SECTION *
 ******************/

export const setCurrentUser = () => async dispatch => {
    dispatch(createAction(actions.SET_CURRENT_USER))

    try {
        const { currentUser } = await api.getCurrentUser()

        dispatch(createAction(actions.SET_CURRENT_USER_SUCCESS, currentUser))
    } catch {
        dispatch(
            createAction(
                actions.SET_CURRENT_USER_ERROR,
                'Could not load current user'
            )
        )
    }
}

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
    dispatch(createAction(actions.SET_SELECTED_MESSAGE_CONVERSATION))

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

export const updateMessageConversations = ({
    messageConversationIds,
    identifier,
    value,
    messageType,
    selectedMessageConversation,
}) => async dispatch => {
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
                            .addRecipients({
                                users: value.map(value => ({
                                    id: value,
                                })),
                                userGroups: [],
                                organisationUnits: [],
                                messageConversationId,
                            })
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
        } catch (error) {
            dispatch(
                createAction(actions.MESSAGE_CONVERSATION_UPDATE_ERROR, {
                    error,
                })
            )
        }
    }

    if (selectedMessageConversation) {
        dispatch(setSelectedMessageConversation(selectedMessageConversation))
    }
}

export const loadMessageConversations = (
    messageType,
    selectedMessageType,
    loadMore = false
) => async (dispatch, getState) => {
    const promises = []
    const state = getState()
    const {
        messageFilter,
        statusFilter: status,
        priorityFilter: priority,
        assignedToMeFilter,
        markedForFollowUpFilter,
        unreadFilter,
        currentUser,
    } = state.messaging

    // Default fallback values so this action can be called without arguments
    messageType = messageType || state.messaging.selectedMessageType
    selectedMessageType =
        selectedMessageType || state.messaging.selectedMessageType.id

    dispatch(
        createAction(actions.LOAD_MESSAGE_CONVERSATIONS, {
            messageType,
            loadMore,
        })
    )

    try {
        for (let i = 1; i <= messageType.page; i++) {
            const promise = api
                .getMessageConversations({
                    messageType: messageType.id,
                    page: i,
                    messageFilter,
                    status,
                    priority,
                    assignedToMeFilter,
                    markedForFollowUpFilter,
                    unreadFilter,
                    currentUser,
                })
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
                messageType,
                selectedMessageType,
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

export const sendMessage = ({
    users,
    userGroups,
    organisationUnits,
    messageType,
}) => async (dispatch, getState) => {
    try {
        const {
            messaging: { subject, input, attachments },
        } = getState()

        await api.sendMessage({
            subject,
            users,
            userGroups,
            organisationUnits,
            text: input,
            attachments,
        })

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

export const replyMessage = ({
    message,
    internalReply,
    messageConversation,
    messageType,
}) => async (dispatch, getState) => {
    try {
        const { id } = messageConversation
        const state = getState()
        const attachments = state.messaging.attachments.map(
            attachment => attachment.id
        )

        await api.replyMessage({
            message,
            internalReply,
            attachments,
            id,
        })

        dispatch(
            createAction(actions.REPLY_MESSAGE_SUCCESS, {
                messageConversation: messageConversation,
                messageType: messageType,
                page: 1,
            })
        )

        dispatch(loadMessageConversations())
        dispatch(setSelectedMessageConversation(messageConversation))
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

export const addRecipients = ({
    users,
    userGroups,
    organisationUnits,
    messageConversation,
    messageType,
}) => async dispatch => {
    try {
        const { id: messageConversationId } = messageConversation

        await api.addRecipients({
            users,
            userGroups,
            organisationUnits,
            messageConversationId,
        })

        dispatch(
            createAction(actions.ADD_RECIPIENTS_SUCCESS, {
                messageConversation: messageConversation,
                messageType: messageType,
                page: 1,
            })
        )

        dispatch(setSelectedMessageConversation(messageConversation))
    } catch (error) {
        dispatch(createAction(actions.ADD_RECIPIENTS_ERROR, { error }))
    }
}

export const addRecipientByUserId = id => async dispatch => {
    try {
        const user = await api.getUserById(id)

        dispatch(createAction(actions.ADD_RECIPIENT_BY_ID_SUCCESS, user))
    } catch (error) {
        console.error(error)
        // No action required, the field will just be empty
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

/************************
 * PLAIN ACTION SECTION *
 ************************/

export const clearSnackMessage = () => createAction(actions.CLEAR_SNACK_MESSAGE)

export const clearCheckedIds = () => createAction(actions.CLEAR_CHECKED)

export const clearSelectedMessageConversation = () =>
    createAction(actions.CLEAR_SELECTED_MESSAGE_CONVERSATION)

export const displaySnackMessage = ({
    message,
    onSnackActionClick,
    onSnackRequestClose,
    snackType,
}) =>
    createAction(actions.DISPLAY_SNACK_MESSAGE, {
        message,
        onSnackActionClick,
        onSnackRequestClose,
        snackType,
    })

export const setAllChecked = messageConversationIds =>
    createAction(actions.SET_ALL_CHECKED, { messageConversationIds })

export const setChecked = (messageConversation, selectedValue) =>
    createAction(actions.SET_CHECKED, { messageConversation, selectedValue })

export const setFilter = (filter, filterType) =>
    createAction(actions.SET_FILTER, { filter, filterType })

export const updateInputFields = (subject, input, recipients) =>
    createAction(actions.UPDATE_INPUT_FIELDS, { subject, input, recipients })

export const clearAttachments = () => createAction(actions.CLEAR_ATTACHMENTS)

export const setSelectedMessageType = messageTypeId =>
    createAction(actions.SET_SELECTED_MESSAGE_TYPE, { messageTypeId })

export const removeAttachment = attachmentId =>
    createAction(actions.REMOVE_ATTACHMENT, { attachmentId })

export const cancelAttachment = attachmentName =>
    createAction(actions.CANCEL_ATTACHMENT, { attachmentName })

export const setIsInFeedbackRecipientGroup = isInFeedbackRecipientGroup =>
    createAction(actions.SET_IN_FEEDBACK_RECIPIENT_GROUP, {
        isInFeedbackRecipientGroup,
    })

export const setDhis2CoreVersion = version =>
    createAction(actions.SET_DHIS2_CORE_VERSION, version)
