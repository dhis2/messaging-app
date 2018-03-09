import * as actions from 'constants/actions';
import { combineEpics } from 'redux-observable';

import history from 'utils/history';
import * as api from 'api/api';

const loadMessageConversations = action$ =>
  action$
    .ofType(
      actions.LOAD_MESSAGE_CONVERSATIONS,
  )
    .concatMap(action =>
      api
        .getMessageConversations(action.payload.messageType)
        .then(messageConversations => ({
          type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
          payload: { messageConversations },
          messageType: action.payload.messageType,
        }))
        .catch(error => ({
          type: actions.MESSAGE_CONVERSATIONS_LOAD_ERROR,
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
  loadMessageConversations,
  markMessageConversationsRead,
  markMessageConversationsUnread,
  searchForRecipients
);