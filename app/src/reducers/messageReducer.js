import i18n from 'd2-i18n';

import * as actions from 'constants/actions';
import messageTypes from '../constants/messageTypes';

import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development';

export const initialState = {
    // Message conversation
    messageConversations: {},
    messageTypes,
    selectedMessageType: undefined,
    selectedMessageConversation: undefined,
    checkedIds: [],
    messageFilter: undefined,
    statusFilter: undefined,
    priorityFilter: undefined,
    isInFeedbackRecipientGroup: false,
    displayTimeDiff: 0,

    // Input for create and reply
    subject: '',
    input: '',
    recipients: [],

    // Snackbar
    snackMessage: '',
    onSnackActionClick: undefined,
    onSnackRequestClose: undefined,
    snackType: NEUTRAL,
};

function messageReducer(state = initialState, action) {
    const messageTypes = state.messageTypes;

    switch (action.type) {
        case actions.SET_DISPLAY_TIME_DIFF_SUCCESS:
            return {
                ...state,
                displayTimeDiff: action.displayTimeDiff,
            };

        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS: {
            const replaceMessageType = _.find(messageTypes, { id: action.messageType.id });
            replaceMessageType.loaded = action.payload.messageConversations.length;
            replaceMessageType.total = action.payload.pager.total;
            replaceMessageType.unread = action.nrOfUnread;
            replaceMessageType.page = action.payload.pager.page;
            replaceMessageType.loading = false;
            messageTypes.splice(
                [_.findIndex(messageTypes, { id: replaceMessageType.id })],
                1,
                replaceMessageType,
            );

            const setSelectedMessageType =
                action.selectedMessageType === replaceMessageType.id &&
                (action.selectedMessageType === state.selectedMessageType ||
                    state.selectedMessageType === undefined);

            return {
                ...state,
                messageTypes,
                messageConversations: {
                    ...state.messageConversations,
                    [replaceMessageType.id]: action.payload.messageConversations,
                },
                selectedMessageType: setSelectedMessageType
                    ? replaceMessageType
                    : state.selectedMessageType,
            };
        }

        case actions.MESSAGE_CONVERSATION_UPDATE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            };

        case actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS: {
            let snackMessage = '';
            switch (action.payload.identifier) {
                case 'STATUS':
                    snackMessage = i18n.t('Successfully updated status');
                    break;
                case 'PRIORITY':
                    snackMessage = i18n.t('Successfully updated priority');
                    break;
                case 'ASSIGNEE':
                    snackMessage = i18n.t('Successfully updated assignee');
                    break;
                default:
                    console.error('Unexpected identifier for updateMessageConversations success');
                    break;
            }

            return {
                ...state,
                snackMessage,
                snackType: POSITIVE,
            };
        }

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
                snackMessage: i18n.t('Successfully deleted message conversation(s)'),
                snackType: POSITIVE,
            };

        case actions.DISPLAY_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: action.payload.message,
                snackType: action.payload.snackType,
                onSnackActionClick: action.payload.onSnackActionClick,
                onSnackRequestClose: action.payload.onSnackRequestClose,
            };

        case actions.CLEAR_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: '',
                snackType: NEUTRAL,
            };

        case actions.SET_CHECKED: {
            const messageConversation = action.payload.messageConversation;

            let checkedIds = state.checkedIds;
            if (action.payload.selectedValue) {
                checkedIds.push({ id: messageConversation.id });
            } else {
                checkedIds = checkedIds.filter(element => element.id !== messageConversation.id);
            }

            return {
                ...state,
                checkedIds,
            };
        }

        case actions.SET_ALL_CHECKED:
            return {
                ...state,
                checkedIds: action.payload.messageConversationIds,
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

        case actions.UPDATE_INPUT_FIELDS:
            return {
                ...state,
                subject: action.payload.subject,
                input: action.payload.input,
                recipients: action.payload.recipients,
            };

        case actions.SET_FILTER:
            return {
                ...state,
                messageFilter:
                    action.payload.filterType === 'MESSAGE'
                        ? action.payload.filter
                        : state.messageFilter,
                statusFilter:
                    action.payload.filterType === 'STATUS'
                        ? action.payload.filter
                        : state.statusFilter,
                priorityFilter:
                    action.payload.filterType === 'PRIORITY'
                        ? action.payload.filter
                        : state.priorityFilter,
            };

        case actions.LOAD_MESSAGE_CONVERSATIONS: {
            const loadingMessageType = action.payload.messageType;
            loadingMessageType.loading = true;

            messageTypes[
                _.findIndex(messageTypes, { id: loadingMessageType.id })
            ] = loadingMessageType;

            const selectedMessageType = state.selectedMessageType;
            if (selectedMessageType) selectedMessageType.loading = true;
            return {
                ...state,
                messageTypes,
                selectedMessageType,
            };
        }

        case actions.SET_IN_FEEDBACK_RECIPIENT_GROUP:
            return {
                ...state,
                isInFeedbackRecipientGroup: action.payload.isInFeedbackRecipientGroup,
            };

        default:
            return state;
    }
}

export default messageReducer;
