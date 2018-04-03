import * as actions from 'constants/actions';
import { combineEpics } from 'redux-observable';

import history from 'utils/history';
import * as api from 'api/api';
import { concatMap } from 'rxjs/operator/concatMap';
import { mergeMap, mergeAll } from 'rxjs/operators';
import { merge } from 'rxjs/operator/merge';

import {Observable} from 'rxjs/Rx'

const updateMessageConversationStatus = action$ =>
  action$
    .ofType(
      actions.UPDATE_MESSAGE_CONVERSATION_STATUS,
  )
    .switchMap(action =>
      api
        .updateMessageConversationStatus(action.payload.messageConversation)
        .then(() => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
          payload: { messageType: action.payload.messageConversation.messageType, page: 1, identifier: action.payload.identifier  }
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_ERROR,
          payload: { error },
        })));

const updateMessageConversationPriority = action$ =>
  action$
    .ofType(
      actions.UPDATE_MESSAGE_CONVERSATION_PRIORITY,
  )
    .switchMap(action =>
      api
        .updateMessageConversationPriority(action.payload.messageConversation)
        .then(() => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
          payload: { messageType: action.payload.messageConversation.messageType, page: 1, identifier: action.payload.identifier }
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_ERROR,
          payload: { error },
        })));

const updateMessageConversationAssignee = action$ =>
  action$
    .ofType(
      actions.UPDATE_MESSAGE_CONVERSATION_ASSIGNEE,
  )
    .switchMap(action =>
      api
        .updateMessageConversationAssignee(action.payload.messageConversation)
        .then(() => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
          payload: { messageType: action.payload.messageConversation.messageType, page: 1, identifier: action.payload.identifier  }
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATION_UPDATE_ERROR,
          payload: { error },
        })));

const sucess = action$ =>
  action$
    .ofType(
      actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS
    )
    .mergeMap(action => 
      Observable.of({
        type: actions.MESSAGE_TYPE_LOADED,
        payload: { messageType: action.payload.messageType }
      })
    )

const loadMessageConversations = action$ =>
  action$
    .ofType(
      actions.LOAD_MESSAGE_CONVERSATIONS,
      actions.MARK_MESSAGE_CONVERSATIONS_READ_SUCCESS,
      actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
      actions.MESSAGE_CONVERSATION_DELETE_SUCCESS,
      actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS,
      actions.SEND_MESSAGE_SUCCESS,
      actions.REPLY_MESSAGE_SUCCESS,
  )
    .mergeMap(action =>
      api
        .getMessageConversations(action.payload.messageType, action.payload.page)
        .then(result =>
          api.getNrOfUnread(action.payload.messageType)
            .then(nrOfUnread => ({
              type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
              payload: { messageConversations: result.messageConversations, pager: result.pager },
              nrOfUnread: nrOfUnread,
              messageType: action.payload.messageType,
            }))
        )
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
          payload: { error },
        }),
          Observable.of({
            type: actions.MESSAGE_TYPE_LOADING,
            payload: { messageType: action.payload.messageType }
          })
        ));

const deleteMessageConversation = action$ =>
  action$
    .ofType(
      actions.DELETE_MESSAGE_CONVERSATION,
  )
    .concatMap(action =>
      api
        .deleteMessageConversation(action.payload.messageConversationId)
        .then(result => ({
          type: actions.MESSAGE_CONVERSATION_DELETE_SUCCESS,
          payload: { messageType: action.payload.messageType, page: 1 }
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATION_DELETE_ERROR,
          payload: { error },
        })));

const sendMessage = action$ =>
  action$
    .ofType(
      actions.SEND_MESSAGE,
  )
    .concatMap(action =>
      api
        .sendMessage(action.payload.subject, action.payload.users, action.payload.message, action.payload.messageConversationId)
        .then(() => ({
          type: actions.SEND_MESSAGE_SUCCESS,
          payload: { messageType: action.payload.messageType.id, page: 1 }
        }))
        .catch(error => ({
          type: actions.SEND_MESSAGE_ERROR,
          payload: { error },
        })));

const replyMessage = action$ =>
  action$
    .ofType(
      actions.REPLY_MESSAGE,
  )
    .concatMap(action =>
      api
        .replyMessage(action.payload.message, action.payload.messageConversation.id)
        .then(() => ({
          type: actions.REPLY_MESSAGE_SUCCESS,
          payload: { messageType: action.payload.messageConversation.messageType, page: 1 }
        }))
        .catch(error => ({
          type: actions.REPLY_MESSAGE_ERROR,
          payload: { error },
        })));

const markMessageConversationsRead = action$ =>
  action$
    .ofType(
      actions.MARK_MESSAGE_CONVERSATIONS_READ,
  )
    .concatMap(action =>
      api
        .markRead(action.payload.markedReadConversations)
        .then(() => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_READ_SUCCESS,
          payload: { messageType: action.payload.messageType, page: 1 }
        }))
        .catch(error => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_READ_ERROR,
          payload: { error },
        })));

const markMessageConversationsUnread = action$ => {
  return action$
    .ofType(
      actions.MARK_MESSAGE_CONVERSATIONS_UNREAD,
  )
    .concatMap(action =>
      api
        .markUnread(action.payload.markedUnreadConversations)
        .then(() => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
          payload: { messageType: action.payload.messageType, page: 1 }
        }))
        .catch(error => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_ERROR,
          payload: { error },
        })))
};


const searchForRecipients = action$ =>
  action$
    .ofType(
      actions.RECIPIENT_SEARCH,
  )
    .switchMap(action =>
      api
        .getUsers(action.payload.searchValue)
        .then(suggestions => ({
          type: actions.RECIPIENT_SEARCH_SUCCESS,
          payload: { suggestions },
        }))
        .catch(error => ({
          type: actions.RECIPIENT_SEARCH_ERROR,
          payload: { error },
        })));

export default combineEpics(
  updateMessageConversationStatus,
  updateMessageConversationPriority,
  updateMessageConversationAssignee,
  loadMessageConversations,
  sendMessage,
  replyMessage,
  deleteMessageConversation,
  markMessageConversationsRead,
  markMessageConversationsUnread,
  searchForRecipients
);