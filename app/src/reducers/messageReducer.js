import i18n from 'd2-i18n';
import log from 'loglevel';

import * as actions from 'constants/actions';
import messageTypes from '../constants/messageTypes';

import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development';

const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const remove = require('lodash/remove');

export const initialState = {
    // Message conversation
    messageConversations: {},
    messageTypes,
    selectedMessageType: undefined,
    selectedMessageConversation: undefined,
    settingSelectedMessageConversation: false,
    checkedIds: [],
    messageFilter: undefined,
    statusFilter: undefined,
    priorityFilter: undefined,
    assignedToMeFilter: false,
    markedForFollowUpFilter: false,
    unreadFilter: false,
    isInFeedbackRecipientGroup: false,
    feedbackRecipientsId: undefined,
    displayTimeDiff: 0,

    // Input for create and reply
    subject: '',
    input: '',
    recipients: [],

    // Attachments
    attachments: [],

    // Snackbar
    snackMessage: '',
    onSnackActionClick: undefined,
    onSnackRequestClose: undefined,
    snackType: NEUTRAL,
};

function messageReducer(state = initialState, action) {
    const stateMessageTypes = state.messageTypes;
    let oldAttachments = state.attachments;

    switch (action.type) {
        case actions.SET_DISPLAY_TIME_DIFF_SUCCESS:
            return {
                ...state,
                displayTimeDiff: action.displayTimeDiff,
            };

        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS: {
            const replaceMessageType = find(stateMessageTypes, { id: action.messageType.id });
            replaceMessageType.loaded = action.payload.messageConversations.length;
            replaceMessageType.total = action.payload.pager.total;
            replaceMessageType.unread = action.nrOfUnread;
            replaceMessageType.page = action.payload.pager.page;
            replaceMessageType.loading = false;
            messageTypes.splice(
                [findIndex(stateMessageTypes, { id: replaceMessageType.id })],
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
                case 'FOLLOW_UP':
                    snackMessage = i18n.t('Successfully changed followup');
                    break;
                default:
                    log.error('Unexpected identifier for updateMessageConversations success');
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
                checkedIds.push(messageConversation);
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
                settingSelectedMessageConversation: false,
            };

        case actions.SET_SELECTED_MESSAGE_CONVERSATION:
            return {
                ...state,
                settingSelectedMessageConversation: true,
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
                selectedMessageType: find(stateMessageTypes, {
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
                assignedToMeFilter:
                    action.payload.filterType === 'ASSIGNED_TO_ME'
                        ? action.payload.filter
                        : state.assignedToMeFilter,
                markedForFollowUpFilter:
                    action.payload.filterType === 'MARKED_FOR_FOLLOWUP'
                        ? action.payload.filter
                        : state.markedForFollowUpFilter,
                unreadFilter:
                    action.payload.filterType === 'UNREAD'
                        ? action.payload.filter
                        : state.unreadFilter,
            };

        case actions.LOAD_MESSAGE_CONVERSATIONS: {
            const loadingMessageType = action.payload.messageType;
            loadingMessageType.loading = true;

            messageTypes[
                findIndex(messageTypes, { id: loadingMessageType.id })
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
                isInFeedbackRecipientGroup: action.payload.isInFeedbackRecipientGroup.authorized,
                feedbackRecipientsId:
                    action.payload.isInFeedbackRecipientGroup.feedbackRecipientsId,
            };

        case actions.ADD_ATTACHMENT_SUCCESS:
            return {
                ...state,
                attachments: state.attachments.map(
                    attachment =>
                        attachment.name === action.attachment.name
                            ? {
                                  id: action.attachment.id,
                                  name: attachment.name,
                                  size: attachment.size,
                                  loading: false,
                              }
                            : attachment,
                ),
            };

        case actions.ADD_ATTACHMENT_ERROR:
            remove(oldAttachments, attachment => attachment.id === action.payload.attachmentId);

            return {
                ...state,
                attachments: oldAttachments,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            };

        case actions.ADD_ATTACHMENT:
            return {
                ...state,
                attachments: state.attachments.concat({
                    name: action.payload.attachment.name,
                    size: action.payload.attachment.size,
                    loading: true,
                }),
            };

        case actions.REMOVE_ATTACHMENT:
            remove(oldAttachments, attachment => attachment.id === action.payload.attachmentId);

            return {
                ...state,
                attachments: oldAttachments,
            };

        case actions.CANCEL_ATTACHMENT:
            remove(oldAttachments, attachment => attachment.name === action.payload.attachmentName);

            return {
                ...state,
                attachments: oldAttachments,
            };

        case actions.CLEAR_ATTACHMENTS:
            return {
                ...state,
                attachments: [],
            };

        default:
            return state;
    }
}

export default messageReducer;
