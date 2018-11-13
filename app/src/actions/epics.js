import * as actions from 'constants/actions'
import { combineEpics } from 'redux-observable'

import log from 'loglevel'

import * as api from 'api/api'

import { Observable } from 'rxjs/Rx'

const moment = require('moment')

// Simple hack to solve negative time difference
const FUTURE_HACK = 5000

const createAction = (type, payload) => ({ type, payload })

const setDisplayTimeDiff = action$ =>
    action$.ofType(actions.SET_DISPLAY_TIME_DIFF).switchMap(() =>
        api
            .getServerDate()
            .then(serverDate => ({
                type: actions.SET_DISPLAY_TIME_DIFF_SUCCESS,
                displayTimeDiff:
                    moment().diff(moment(serverDate)) - FUTURE_HACK,
            }))
            .catch(error => ({
                type: actions.SET_DISPLAY_TIME_DIFF_ERROR,
                payload: { error },
            }))
    )

const setSelectedMessageConversation = action$ =>
    action$
        .ofType(
            actions.SET_SELECTED_MESSAGE_CONVERSATION,
            actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
            actions.ADD_RECIPIENTS_SUCCESS,
            actions.REPLY_MESSAGE_SUCCESS
        )
        .switchMap(action =>
            api
                .getMessageConversation(action.payload.messageConversation)
                .then(result => ({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION_SUCCESS,
                    payload: {
                        messageConversation: result,
                    },
                }))
                .catch(error => ({
                    type: actions.SET_SELECTED_MESSAGE_CONVERSATION_ERROR,
                    payload: { error },
                }))
        )

const updateMessageConversations = action$ =>
    action$.ofType(actions.UPDATE_MESSAGE_CONVERSATIONS).concatMap(action => {
        let updateObservable
        if (action.payload.identifier === 'FOLLOW_UP') {
            updateObservable = Observable.from(
                api
                    .updateMessageConversationFollowup(
                        action.payload.messageConversationIds,
                        action.payload.value
                    )
                    .then(() => ({
                        type: actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
                        payload: {
                            messageType: action.payload.messageType,
                            page: 1,
                            identifier: action.payload.identifier,
                        },
                    }))
                    .catch(error => ({
                        type: actions.MESSAGE_CONVERSATION_UPDATE_ERROR,
                        payload: { error },
                    }))
            )
        } else {
            const promises = action.payload.messageConversationIds.map(
                messageConversationId => {
                    let promise
                    switch (action.payload.identifier) {
                        case 'STATUS':
                            promise = api.updateMessageConversationStatus(
                                messageConversationId,
                                action.payload.value
                            )
                            break
                        case 'PRIORITY':
                            promise = api.updateMessageConversationPriority(
                                messageConversationId,
                                action.payload.value
                            )
                            break
                        case 'ASSIGNEE':
                            if (
                                action.payload.value !== undefined &&
                                action.payload.messageType.id ===
                                    'VALIDATION_RESULT'
                            ) {
                                promise = api
                                    .addRecipients(
                                        action.payload.value.map(value => ({
                                            id: value,
                                        })),
                                        [],
                                        [],
                                        messageConversationId
                                    )
                                    .then(() =>
                                        api.updateMessageConversationAssignee(
                                            messageConversationId,
                                            action.payload.value
                                        )
                                    )
                            } else {
                                promise = api.updateMessageConversationAssignee(
                                    messageConversationId,
                                    action.payload.value
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
                }
            )

            updateObservable = Observable.from(
                Promise.all(promises)
                    .then(() => ({
                        type: actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
                        payload: {
                            messageType: action.payload.messageType,
                            page: 1,
                            identifier: action.payload.identifier,
                        },
                    }))
                    .catch(error => ({
                        type: actions.MESSAGE_CONVERSATION_UPDATE_ERROR,
                        payload: { error },
                    }))
            )
        }

        const setSelectedObservable = Observable.of({
            type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
            payload: {
                messageConversation: action.payload.selectedMessageConversation,
            },
        })

        return action.payload.selectedMessageConversation
            ? updateObservable.concat(setSelectedObservable)
            : updateObservable
    })

const loadMoreMessageConversations = action$ =>
    action$
        .ofType(actions.LOAD_MORE_MESSAGE_CONVERSATIONS)
        .debounceTime(100)
        .concatMap(action =>
            Observable.of({
                type: actions.LOAD_MESSAGE_CONVERSATIONS,
                payload: action.payload,
            })
        )

const loadMessageConversations = (action$, store) =>
    action$
        .ofType(
            actions.LOAD_MESSAGE_CONVERSATIONS,
            actions.MARK_MESSAGE_CONVERSATIONS_SUCCESS,
            actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
            actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS,
            actions.SEND_MESSAGE_SUCCESS,
            actions.REPLY_MESSAGE_SUCCESS
        )
        .mergeMap(action => {
            const promises = []

            const state = store.getState()
            for (let i = 1; i <= action.payload.messageType.page; i++) {
                const promise = api
                    .getMessageConversations(
                        action.payload.messageType.id,
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

            return Observable.from(
                Promise.all(promises)
                    .then(result =>
                        api
                            .getNrOfUnread(action.payload.messageType.id)
                            .then(nrOfUnread => {
                                const messageConversations = result.reduce(
                                    (accumulated, r) =>
                                        accumulated.concat(
                                            r.messageConversations
                                        ),
                                    []
                                )

                                return {
                                    type:
                                        actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
                                    payload: {
                                        messageConversations,
                                        pager: result[result.length - 1].pager,
                                    },
                                    messageType: action.payload.messageType,
                                    selectedMessageType:
                                        action.payload.selectedMessageType,
                                    nrOfUnread,
                                }
                            })
                    )
                    .catch(error => ({
                        type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
                        payload: { error },
                    }))
            )
        })

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
    } catch (error) {
        dispatch(createAction(actions.SEND_MESSAGE_ERROR, { error }))
    }
}

const replyMessage = (action$, store) =>
    action$.ofType(actions.REPLY_MESSAGE).concatMap(action => {
        const state = store.getState()

        return api
            .replyMessage(
                action.payload.message,
                action.payload.internalReply,
                state.messaging.attachments.map(attachment => attachment.id),
                action.payload.messageConversation.id
            )
            .then(() => ({
                type: actions.REPLY_MESSAGE_SUCCESS,
                payload: {
                    messageConversation: action.payload.messageConversation,
                    messageType: action.payload.messageType,
                    page: 1,
                },
            }))
            .catch(error => ({
                type: actions.REPLY_MESSAGE_ERROR,
                payload: { error },
            }))
    })

const markMessageConversations = action$ =>
    action$.ofType(actions.MARK_MESSAGE_CONVERSATIONS).concatMap(action => {
        let promise
        if (action.payload.mode === 'read') {
            promise = api.markRead(action.payload.markedConversations)
        } else {
            promise = api.markUnread(action.payload.markedConversations)
        }

        return promise
            .then(() => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_SUCCESS,
                payload: {
                    messageType: action.payload.messageType,
                    page: 1,
                },
            }))
            .catch(error => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_ERROR,
                payload: { error },
            }))
    })

const addRecipients = action$ =>
    action$.ofType(actions.ADD_RECIPIENTS).concatMap(action =>
        api
            .addRecipients(
                action.payload.users,
                action.payload.userGroups,
                action.payload.organisationUnits,
                action.payload.messageConversation.id
            )
            .then(() => ({
                type: actions.ADD_RECIPIENTS_SUCCESS,
                payload: {
                    messageConversation: action.payload.messageConversation,
                    messageType: action.payload.messageType,
                    page: 1,
                },
            }))
            .catch(error => ({
                type: actions.ADD_RECIPIENTS_ERROR,
                payload: { error },
            }))
    )

const addAttachment = action$ =>
    action$.ofType(actions.ADD_ATTACHMENT).mergeMap(action =>
        Observable.from(
            api
                .addAttachment(action.payload.attachment)
                .then(result => ({
                    type: actions.ADD_ATTACHMENT_SUCCESS,
                    attachment: {
                        id: result.response.fileResource.id,
                        name: action.payload.attachment.name,
                        contentLength:
                            result.response.fileResource.contentLength,
                    },
                }))
                .catch(error => ({
                    type: actions.ADD_ATTACHMENT_ERROR,
                    payload: { error },
                }))
        ).takeUntil(
            action$
                .ofType(actions.CANCEL_ATTACHMENT)
                .filter(
                    cancelAction =>
                        cancelAction.payload.attachmentName ===
                        action.payload.attachment.name
                )
        )
    )

const downloadAttachment = action$ =>
    action$.ofType(actions.DOWNLOAD_ATTACHMENT).concatMap(action =>
        api
            .downloadAttachment(
                action.payload.messageConversationId,
                action.payload.messageId,
                action.payload.attachmentId
            )
            .then(result => ({
                type: actions.DOWNLOAD_ATTACHMENT_SUCCESS,
            }))
            .catch(error => ({
                type: actions.DOWNLOAD_ATTACHMENT_ERROR,
                payload: { error },
            }))
    )

export default combineEpics(
    setDisplayTimeDiff,
    setSelectedMessageConversation,
    updateMessageConversations,
    markMessageConversations,
    loadMoreMessageConversations,
    loadMessageConversations,
    // sendMessage,
    // sendFeedbackMessage,
    replyMessage,
    // deleteMessageConversations,
    addRecipients,
    addAttachment,
    downloadAttachment
)
