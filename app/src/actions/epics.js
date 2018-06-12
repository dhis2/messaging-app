import * as actions from 'constants/actions';
import { combineEpics } from 'redux-observable';

import { getInstance as getD2wInstance } from 'd2/lib/d2';
import log from 'loglevel';

import * as api from 'api/api';

import { Observable } from 'rxjs/Rx';

const moment = require('moment');

// Simple hack to solve negative time difference
const ONE_SECOND = 1000;

const setDisplayTimeDiff = action$ =>
    action$.ofType(actions.SET_DISPLAY_TIME_DIFF).switchMap(() =>
        api
            .getServerDate()
            .then(serverDate => ({
                type: actions.SET_DISPLAY_TIME_DIFF_SUCCESS,
                displayTimeDiff: moment().diff(moment(serverDate)) - ONE_SECOND,
            }))
            .catch(error => ({
                type: actions.SET_DISPLAY_TIME_DIFF_ERROR,
                payload: { error },
            })),
    );

const setSelectedMessageConversation = action$ =>
    action$
        .ofType(
            actions.SET_SELECTED_MESSAGE_CONVERSATION,
            actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
            actions.ADD_RECIPIENTS_SUCCESS,
            actions.REPLY_MESSAGE_SUCCESS,
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
                })),
        );

const updateMessageConversations = action$ =>
    action$.ofType(actions.UPDATE_MESSAGE_CONVERSATIONS).concatMap(action => {
        const promises = action.payload.messageConversationIds.map(messageConversationId => {
            let promise;
            switch (action.payload.identifier) {
                case 'STATUS':
                    promise = api.updateMessageConversationStatus(
                        messageConversationId,
                        action.payload.value,
                    );
                    break;
                case 'PRIORITY':
                    promise = api.updateMessageConversationPriority(
                        messageConversationId,
                        action.payload.value,
                    );
                    break;
                case 'ASSIGNEE':
                    promise = api.updateMessageConversationAssignee(
                        messageConversationId,
                        action.payload.value,
                    );
                    break;
                default:
                    log.error('Unexpected identifier for updateMessageConversations');
                    break;
            }
            return promise;
        });

        const updateObservable = Observable.from(
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
                })),
        );

        const setSelectedObservable = Observable.of({
            type: actions.SET_SELECTED_MESSAGE_CONVERSATION,
            payload: {
                messageConversation: action.payload.selectedMessageConversation,
            },
        });

        return action.payload.selectedMessageConversation
            ? updateObservable.concat(updateObservable, setSelectedObservable)
            : updateObservable.concat(updateObservable);
    });

const updateMessageConversationStatus = action$ =>
    action$.ofType(actions.UPDATE_MESSAGE_CONVERSATION_STATUS).switchMap(action =>
        api
            .updateMessageConversationStatus(action.payload.messageConversation)
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
            })),
    );

const updateMessageConversationPriority = action$ =>
    action$.ofType(actions.UPDATE_MESSAGE_CONVERSATION_PRIORITY).switchMap(action =>
        api
            .updateMessageConversationPriority(action.payload.messageConversation)
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
            })),
    );

const updateMessageConversationAssignee = action$ =>
    action$.ofType(actions.UPDATE_MESSAGE_CONVERSATION_ASSIGNEE).switchMap(action =>
        api
            .updateMessageConversationAssignee(action.payload.messageConversation)
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
            })),
    );

const loadMoreMessageConversations = action$ =>
    action$
        .ofType(actions.LOAD_MORE_MESSAGE_CONVERSATIONS)
        .debounceTime(100)
        .concatMap(action =>
            Observable.of({
                type: actions.LOAD_MESSAGE_CONVERSATIONS,
                payload: action.payload,
            }),
        );

const loadMessageConversations = action$ =>
    action$
        .ofType(
            actions.LOAD_MESSAGE_CONVERSATIONS,
            actions.MARK_MESSAGE_CONVERSATIONS_READ_SUCCESS,
            actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
            actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
            actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS,
            actions.SEND_MESSAGE_SUCCESS,
            actions.REPLY_MESSAGE_SUCCESS,
        )
        .mergeMap(action => {
            const promises = [];

            for (let i = 1; i <= action.payload.messageType.page; i++) {
                const promise = api
                    .getMessageConversations(
                        action.payload.messageType.id,
                        i,
                        action.payload.messageFilter,
                        action.payload.statusFilter,
                        action.payload.priorityFilter,
                    )
                    .then(result => ({
                        messageConversations: result.messageConversations,
                        pager: result.pager,
                    }));

                promises.push(promise);
            }

            return Observable.from(
                Promise.all(promises)
                    .then(result =>
                        api.getNrOfUnread(action.payload.messageType.id).then(nrOfUnread => {
                            const messageConversations = result.reduce(
                                (accumulated, r) => accumulated.concat(r.messageConversations),
                                [],
                            );

                            return {
                                type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
                                payload: {
                                    messageConversations,
                                    pager: result[result.length - 1].pager,
                                },
                                messageType: action.payload.messageType,
                                selectedMessageType: action.payload.selectedMessageType,
                                nrOfUnread,
                            };
                        }),
                    )
                    .catch(error => ({
                        type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
                        payload: { error },
                    })),
            );
        });

const deleteMessageConversations = action$ =>
    action$.ofType(actions.DELETE_MESSAGE_CONVERSATIONS).concatMap(action => {
        const promises = action.payload.messageConversationIds.map(messageConversationId => {
            return api.deleteMessageConversation(messageConversationId);
        });

        return Observable.from(
            Promise.all(promises)
                .then(() => ({
                    type: actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS,
                    payload: { messageType: action.payload.messageType, page: 1 },
                }))
                .catch(error => ({
                    type: actions.MESSAGE_CONVERSATIONS_DELETE_ERROR,
                    payload: { error },
                })),
        );
    });

const sendMessage = action$ =>
    action$.ofType(actions.SEND_MESSAGE).concatMap(action =>
        api
            .sendMessage(
                action.payload.subject,
                action.payload.users,
                action.payload.userGroups,
                action.payload.organisationUnits,
                action.payload.message,
                action.payload.messageConversationId,
            )
            .then(() => ({
                type: actions.SEND_MESSAGE_SUCCESS,
                payload: { messageType: action.payload.messageType, page: 1 },
            }))
            .catch(error => ({
                type: actions.SEND_MESSAGE_ERROR,
                payload: { error },
            })),
    );

const sendFeedbackMessage = action$ =>
    action$.ofType(actions.SEND_FEEDBACK_MESSAGE).concatMap(action =>
        api
            .sendFeedbackMessage(action.payload.subject, action.payload.message)
            .then(() => ({
                type: actions.SEND_MESSAGE_SUCCESS,
                payload: { messageType: action.payload.messageType, page: 1 },
            }))
            .catch(error => ({
                type: actions.SEND_MESSAGE_ERROR,
                payload: { error },
            })),
    );

const replyMessage = action$ =>
    action$.ofType(actions.REPLY_MESSAGE).concatMap(action =>
        api
            .replyMessage(
                action.payload.message,
                action.payload.internalReply,
                action.payload.messageConversation.id,
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
            })),
    );

const markMessageConversationsRead = action$ =>
    action$.ofType(actions.MARK_MESSAGE_CONVERSATIONS_READ).concatMap(action =>
        api
            .markRead(action.payload.markedReadConversations)
            .then(() => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_READ_SUCCESS,
                payload: { messageType: action.payload.messageType, page: 1 },
            }))
            .catch(error => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_READ_ERROR,
                payload: { error },
            })),
    );

const markMessageConversationsUnread = action$ =>
    action$.ofType(actions.MARK_MESSAGE_CONVERSATIONS_UNREAD).concatMap(action =>
        api
            .markUnread(action.payload.markedUnreadConversations)
            .then(() => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
                payload: { messageType: action.payload.messageType, page: 1 },
            }))
            .catch(error => ({
                type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_ERROR,
                payload: { error },
            })),
    );

const addRecipients = action$ =>
    action$.ofType(actions.ADD_RECIPIENTS).concatMap(action =>
        api
            .addRecipients(
                action.payload.users,
                action.payload.userGroups,
                action.payload.organisationUnits,
                action.payload.messageConversation.id,
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
            })),
    );

export default combineEpics(
    setDisplayTimeDiff,
    setSelectedMessageConversation,
    updateMessageConversations,
    updateMessageConversationStatus,
    updateMessageConversationPriority,
    updateMessageConversationAssignee,
    loadMoreMessageConversations,
    loadMessageConversations,
    sendMessage,
    sendFeedbackMessage,
    replyMessage,
    deleteMessageConversations,
    markMessageConversationsRead,
    markMessageConversationsUnread,
    addRecipients,
);
