import * as actions from 'constants/actions';
import { combineEpics } from 'redux-observable';

import history from 'utils/history';
import * as api from 'api/api';

const updateMessageConversations = action$ =>
  action$
    .ofType(
      actions.UPDATE_MESSAGE_CONVERSATIONS,
      actions.MARK_MESSAGE_CONVERSATIONS_READ_SUCCESS,
      actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
      actions.SEND_MESSAGE_SUCCESS
  )
    .concatMap(action =>
      api
        .getMessageConversationsWithIds(action.payload.messageConversationIds)
        .then(result => ({
          type: actions.MESSAGE_CONVERSATIONS_UPDATE_SUCCESS,
          messageConversations: result.messageConversations,
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATIONS_UPDATE_ERROR,
          payload: { error },
        })));

const loadMessageConversations = action$ =>
  action$
    .ofType(
      actions.LOAD_MESSAGE_CONVERSATIONS,
  )
    .concatMap(action =>
      api
        .getMessageConversations(action.payload.messageType, action.payload.page)
        .then( result => 
          api .getNrOfUnread( action.payload.messageType )
              .then( nrOfUnread => ({
                type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
                payload: { messageConversations: result.messageConversations, pager: result.pager },
                nrOfUnread: nrOfUnread,
                messageType: action.payload.messageType,
              }))
        )
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
          payload: { error },
        })));

const sendMessage = action$ =>
  action$
    .ofType(
      actions.SEND_MESSAGE,
  )
    .concatMap(action =>
      api
        .replyMessage(action.payload.message.toString(), action.payload.messageConversationId)
        .then(() => ({
          type: actions.SEND_MESSAGE_SUCCESS,
          payload: { messageConversationIds: [ action.payload.messageConversationId ] }
        }))
        .catch(error => ({
          type: actions.SEND_MESSAGE_ERROR,
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
          payload: { messageConversationIds: action.payload.markedReadConversations }
        }))
        .catch(error => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_READ_ERROR,
          payload: { error },
        })));

const markMessageConversationsUnread = action$ =>
  action$
    .ofType(
      actions.MARK_MESSAGE_CONVERSATIONS_UNREAD,
  )
    .concatMap(action =>
      api
        .markUnread(action.payload.markedUnreadConversations)
        .then(() => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_SUCCESS,
          payload: { messageConversationIds: action.payload.markedUnreadConversations }
        }))
        .catch(error => ({
          type: actions.MARK_MESSAGE_CONVERSATIONS_UNREAD_ERROR,
          payload: { error },
        })));


const searchForRecipients = action$ =>
  action$
    .ofType(
      actions.RECIPIENT_SEARCH,
  )
    .concatMap(action =>
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
  updateMessageConversations,
  loadMessageConversations,
  sendMessage,
  markMessageConversationsRead,
  markMessageConversationsUnread,
  searchForRecipients
);