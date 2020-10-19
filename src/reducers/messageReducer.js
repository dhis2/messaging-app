import i18n from '@dhis2/d2-i18n'
import log from 'loglevel'
import * as actions from '../constants/actions'
import messageTypes from '../constants/messageTypes'
import { POSITIVE, NEGATIVE, NEUTRAL } from '../constants/development'
import { findIndexOfId } from '../utils/helpers'

export const initialState = {
    currentUser: {
        loading: true,
        error: null,
        id: null,
        authorities: null,
        userGroups: null,
    },
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
}

function messageReducer(state = initialState, action) {
    const stateMessageTypes = state.messageTypes
    const oldAttachments = state.attachments

    switch (action.type) {
        case actions.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: {
                    loading: true,
                    error: null,
                    id: null,
                    authorities: null,
                    userGroups: null,
                },
            }
        case actions.SET_CURRENT_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    loading: false,
                    error: null,
                    id: action.payload.id,
                    authorities: action.payload.authorities,
                    userGroups: action.payload.userGroups,
                },
            }
        case actions.SET_CURRENT_USER_ERROR:
            return {
                ...state,
                currentUser: {
                    loading: false,
                    error: action.payload,
                    id: null,
                    authorities: null,
                    userGroups: null,
                },
            }
        case actions.SET_DISPLAY_TIME_DIFF_SUCCESS:
            return {
                ...state,
                displayTimeDiff: action.payload,
                error: action.payload,
                id: null,
                authorities: null,
            }

        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS: {
            const replaceMessageType = stateMessageTypes.find(
                type => type.id === action.payload.messageType.id
            )
            replaceMessageType.loaded =
                action.payload.messageConversations.length
            replaceMessageType.total = action.payload.pager.total
            replaceMessageType.unread = action.payload.nrOfUnread
            replaceMessageType.page = action.payload.pager.page
            replaceMessageType.loading = false
            messageTypes.splice(
                [findIndexOfId(stateMessageTypes, replaceMessageType.id)],
                1,
                replaceMessageType
            )

            const setSelectedMessageType =
                action.payload.selectedMessageType === replaceMessageType.id &&
                (action.payload.selectedMessageType ===
                    state.selectedMessageType ||
                    state.selectedMessageType === undefined)

            return {
                ...state,
                messageTypes,
                messageConversations: {
                    ...state.messageConversations,
                    [replaceMessageType.id]:
                        action.payload.messageConversations,
                },
                selectedMessageType: setSelectedMessageType
                    ? replaceMessageType
                    : state.selectedMessageType,
            }
        }

        case actions.MESSAGE_CONVERSATION_UPDATE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS: {
            let snackMessage = ''
            switch (action.payload.identifier) {
                case 'STATUS':
                    snackMessage = i18n.t('Successfully updated status')
                    break
                case 'PRIORITY':
                    snackMessage = i18n.t('Successfully updated priority')
                    break
                case 'ASSIGNEE':
                    snackMessage = i18n.t('Successfully updated assignee')
                    break
                case 'FOLLOW_UP':
                    snackMessage = i18n.t('Successfully changed followup')
                    break
                default:
                    log.error(
                        'Unexpected identifier for updateMessageConversations success'
                    )
                    break
            }

            return {
                ...state,
                snackMessage,
                snackType: POSITIVE,
            }
        }

        case actions.SEND_MESSAGE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.MESSAGE_CONVERSATIONS_DELETE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.MESSAGE_CONVERSATIONS_DELETE_SUCCESS:
            return {
                ...state,
                snackMessage: i18n.t(
                    'Successfully deleted message conversation(s)'
                ),
                snackType: POSITIVE,
            }

        case actions.DISPLAY_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: action.payload.message,
                snackType: action.payload.snackType,
                onSnackActionClick: action.payload.onSnackActionClick,
                onSnackRequestClose: action.payload.onSnackRequestClose,
            }

        case actions.CLEAR_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: '',
                snackType: NEUTRAL,
            }

        case actions.SET_CHECKED: {
            const messageConversation = action.payload.messageConversation

            let checkedIds = state.checkedIds
            if (action.payload.selectedValue) {
                checkedIds.push(messageConversation)
            } else {
                checkedIds = checkedIds.filter(
                    element => element.id !== messageConversation.id
                )
            }

            return {
                ...state,
                checkedIds,
            }
        }

        case actions.SET_ALL_CHECKED:
            return {
                ...state,
                checkedIds: action.payload.messageConversationIds,
            }

        case actions.CLEAR_CHECKED:
            return {
                ...state,
                checkedIds: [],
            }

        case actions.SET_SELECTED_MESSAGE_CONVERSATION_SUCCESS:
            return {
                ...state,
                selectedMessageConversation: action.payload.messageConversation,
                settingSelectedMessageConversation: false,
            }

        case actions.SET_SELECTED_MESSAGE_CONVERSATION:
            return {
                ...state,
                settingSelectedMessageConversation: true,
            }

        case actions.CLEAR_SELECTED_MESSAGE_CONVERSATION:
            return {
                ...state,
                selectedMessageConversation: undefined,
            }

        case actions.SET_SELECTED_MESSAGE_TYPE:
            return {
                ...state,
                checkedIds: [],
                selectedMessageType: stateMessageTypes.find(
                    type => type.id === action.payload.messageTypeId
                ),
                selectedMessageConversations:
                    state.messageConversations[action.payload.messageTypeId],
                selectedMessageConversation: undefined,
            }

        case actions.UPDATE_INPUT_FIELDS:
            return {
                ...state,
                subject: action.payload.subject,
                input: action.payload.input,
                recipients: action.payload.recipients,
            }

        case actions.ADD_RECIPIENT_BY_ID_SUCCESS:
            return {
                ...state,
                recipients: [...state.recipients, action.payload],
            }

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
            }

        case actions.LOAD_MESSAGE_CONVERSATIONS: {
            const loadingMessageType = action.payload.messageType
            loadingMessageType.loading = true

            if (action.payload.loadMore) {
                loadingMessageType.page++
            }

            messageTypes[
                findIndexOfId(messageTypes, loadingMessageType.id)
            ] = loadingMessageType

            // TODO: This can probably be removed because action.payload.messageType === state.selectedMessageType
            const selectedMessageType = state.selectedMessageType
            if (selectedMessageType) {
                selectedMessageType.loading = true
                if (action.payload.loadMore) {
                    selectedMessageType.page++
                }
            }

            return {
                ...state,
                messageTypes,
                selectedMessageType,
            }
        }

        case actions.SET_IN_FEEDBACK_RECIPIENT_GROUP:
            return {
                ...state,
                isInFeedbackRecipientGroup:
                    action.payload.isInFeedbackRecipientGroup.authorized,
                feedbackRecipientsId:
                    action.payload.isInFeedbackRecipientGroup
                        .feedbackRecipientsId,
            }

        case actions.ADD_ATTACHMENT_SUCCESS:
            return {
                ...state,
                attachments: state.attachments.map(attachment =>
                    attachment.name === action.payload.name
                        ? {
                              id: action.payload.id,
                              name: attachment.name,
                              contentLength: attachment.contentLength,
                              loading: false,
                          }
                        : attachment
                ),
            }

        case actions.ADD_ATTACHMENT_ERROR:
            return {
                ...state,
                attachments: oldAttachments.filter(
                    attachment => attachment.id !== action.payload.attachmentId
                ),
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.ADD_ATTACHMENT:
            return {
                ...state,
                attachments: state.attachments.concat({
                    name: action.payload.name,
                    contentLength: action.payload.size,
                    loading: true,
                }),
            }

        case actions.REMOVE_ATTACHMENT:
            return {
                ...state,
                attachments: oldAttachments.filter(
                    attachment => attachment.id !== action.payload.attachmentId
                ),
            }

        case actions.CANCEL_ATTACHMENT:
            return {
                ...state,
                attachments: oldAttachments.filter(
                    attachment =>
                        attachment.name !== action.payload.attachmentName
                ),
            }

        case actions.CLEAR_ATTACHMENTS:
            return {
                ...state,
                attachments: [],
            }

        case actions.SET_DHIS2_CORE_VERSION:
            return {
                ...state,
                dhis2CoreVersion: action.payload,
            }

        default:
            return state
    }
}

export default messageReducer
