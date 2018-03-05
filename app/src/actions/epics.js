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

export default combineEpics(
  loadMessageConversations,
);