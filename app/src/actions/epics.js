import * as actions from 'constants/actions';
import { combineEpics } from 'redux-observable';

import { getInstance as getD2Instance } from 'd2/lib/d2';

import history from 'utils/history';
import * as api from 'api/api';
import { concatMap } from 'rxjs/operator/concatMap';
import { mergeMap, mergeAll, timeout } from 'rxjs/operators';
import { merge } from 'rxjs/operator/merge';

import { Observable } from 'rxjs/Rx';

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
        let promises = action.payload.messageConversationIds.map(messageConversationId => {
            let promise = undefined;
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
            }
            return promise;
        });

        return Observable.from(
            Promise.all(promises)
                .then(result => ({
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
        )
        .mergeMap(action =>
            api
                .getMessageConversations(
                    action.payload.messageType.id,
                    action.payload.messageType.page,
                    action.payload.messageFilter,
                    action.payload.statusFilter,
                    action.payload.priorityFilter,
                )
                .then(result =>
                    api.getNrOfUnread(action.payload.messageType.id).then(nrOfUnread => ({
                        type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
                        payload: {
                            messageConversations: result.messageConversations,
                            pager: result.pager,
                        },
                        messageType: action.payload.messageType,
                        selectedMessageType: action.payload.selectedMessageType,
                        nrOfUnread: nrOfUnread,
                    })),
                )
                .catch(error => ({
                    type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
                    payload: { error },
                })),
        );

const deleteMessageConversations = action$ =>
    action$.ofType(actions.DELETE_MESSAGE_CONVERSATIONS).concatMap(action => {
        const promises = action.payload.messageConversationIds.map(messageConversationId => {
            return api.deleteMessageConversation(messageConversationId);
        });

        return Observable.from(
            Promise.all(promises)
                .then(result => ({
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

const markMessageConversationsUnread = action$ => {
    return action$.ofType(actions.MARK_MESSAGE_CONVERSATIONS_UNREAD).concatMap(action =>
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
};

const addRecipients = action$ => {
    return action$.ofType(actions.ADD_RECIPIENTS).concatMap(action =>
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
};

export default combineEpics(
    setSelectedMessageConversation,
    updateMessageConversations,
    updateMessageConversationStatus,
    updateMessageConversationPriority,
    updateMessageConversationAssignee,
    loadMoreMessageConversations,
    loadMessageConversations,
    sendMessage,
    replyMessage,
    deleteMessageConversations,
    markMessageConversationsRead,
    markMessageConversationsUnread,
    addRecipients,
);
