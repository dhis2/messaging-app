import * as actions from 'constants/actions';
import messageTypes from '../constants/messageTypes';
import history from 'utils/history';

import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development';

export const initialState = {
    messageConversations: {},
    messageTypes: messageTypes,
    selectedMessageType: undefined,
    selectedMessageConversation: undefined,
    checkedIds: [],
    messageFilter: '',
    snackMessage: '',
    snackType: NEUTRAL,
};

function messageReducer(state = initialState, action) {
    let messageTypes = state.messageTypes;
    let messageType = _.find(messageTypes, { id: action.messageType });

    switch (action.type) {
        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS:
            let replaceMessageType = _.find(messageTypes, { id: action.messageType.id });
            replaceMessageType.loaded =
                replaceMessageType.page == 1
                    ? action.payload.messageConversations.length
                    : replaceMessageType.loaded + action.payload.messageConversations.length;
            replaceMessageType.total = action.payload.pager.total;
            replaceMessageType.unread = action.nrOfUnread;
            replaceMessageType.page = action.payload.pager.page;
            replaceMessageType.loading = false;
            messageTypes.splice(
                [_.findIndex(messageTypes, { id: replaceMessageType.id })],
                1,
                replaceMessageType,
            );

            const prevStateConversations = state.messageConversations[replaceMessageType.id];
            const replaceConversations =
                replaceMessageType.page == 1
                    ? action.payload.messageConversations
                    : _.unionWith(
                          prevStateConversations,
                          action.payload.messageConversations,
                          _.isEqual,
                      );

            const setSelectedMessageType = action.selectedMessageType == replaceMessageType.id;
            return {
                ...state,
                messageTypes: messageTypes,
                messageConversations: {
                    ...state.messageConversations,
                    [replaceMessageType.id]: replaceConversations,
                },
                selectedMessageType: setSelectedMessageType
                    ? replaceMessageType
                    : state.selectedMessageType,
            };

        case actions.MESSAGE_CONVERSATION_UPDATE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            };

        case actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS:
            let snackMessage = '';
            switch (action.payload.identifier) {
                case 'STATUS':
                    snackMessage = 'Successfully updated status';
                    break;
                case 'PRIORITY':
                    snackMessage = 'Successfully updated priority';
                    break;
                case 'ASSIGNEE':
                    snackMessage = 'Successfully updated assignee';
                    break;
            }

            return {
                ...state,
                snackMessage: snackMessage,
                snackType: POSITIVE,
            };

        case actions.SEND_MESSAGE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            };

        case actions.MESSAGE_CONVERSATIONS_DELETE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            };

        case actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS:
            return {
                ...state,
                snackMessage: 'Successfully deleted message conversation(s)',
                snackType: POSITIVE,
            };

        case actions.DISPLAY_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: action.payload.message,
                snackType: action.payload.snackType,
            };

        case actions.CLEAR_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: '',
                snackType: NEUTRAL,
            };

        case actions.SET_CHECKED:
            let messageConversation = action.payload.messageConversation;

            messageConversation.selectedValue = action.payload.selectedValue;
            let checkedIds = state.checkedIds;
            if (action.payload.selectedValue) {
                checkedIds.push({ id: messageConversation.id });
            } else {
                checkedIds = checkedIds.filter(element => element.id != messageConversation.id);
            }

            return {
                ...state,
                checkedIds: checkedIds,
            };

        case actions.CLEAR_CHECKED:
            return {
                ...state,
                checkedIds: [],
            };

        case actions.SET_SELECTED_MESSAGE_CONVERSATION_SUCCESS:
            return {
                ...state,
                selectedMessageConversation: action.payload.messageConversation,
            };

        case actions.CLEAR_SELECTED_MESSAGE_CONVERSATION:
            return {
                ...state,
                selectedMessageConversation: undefined,
            };

        case actions.SET_SELECTED_MESSAGE_TYPE:
            return {
                ...state,
                checkedIds: [],
                selectedMessageType: _.find(state.messageTypes, {
                    id: action.payload.messageTypeId,
                }),
                selectedMessageConversations:
                    state.messageConversations[action.payload.messageTypeId],
                selectedMessageConversation: undefined,
            };

        case actions.SET_MESSAGE_FILTER:
            return {
                ...state,
                messageFilter: action.payload.messageFilter,
            };

        case actions.LOAD_MESSAGE_CONVERSATIONS:
            let loadingMessageType = action.payload.messageType;
            loadingMessageType.loading = true;

            messageTypes[
                _.findIndex(messageTypes, { id: loadingMessageType.id })
            ] = loadingMessageType;
            return {
                ...state,
                messageTypes: messageTypes,
            };

        default:
            return state;
    }
}

export default messageReducer;
