import * as actions from 'constants/actions';
import messageTypes from '../constants/messageTypes';
import i18next from 'i18next';

const NEUTRAL = 'NEUTRAL';
const POSITIVE = 'POSITIVE';
const NEGATIVE = 'NEGATIVE';

export const initialState = {
    messageConversations: {},
    selectedMessageConversation: undefined,
    messageTypes: messageTypes,
    selectedMessageType: undefined,
    selectedIds: [],
    messsageFilter: '',
    loaded: false,
    snackMessage: '',
    snackType: NEUTRAL,
};

function messageReducer(state = initialState, action) {
    let messageTypes = state.messageTypes;
    let messageType = _.find(messageTypes, {id: action.messageType});
    
    switch (action.type) {
        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS:
            let replaceMessageType = action.messageType
            replaceMessageType.loaded = replaceMessageType.page == 1 ? action.payload.messageConversations.length :  replaceMessageType.loaded + action.payload.messageConversations.length
            replaceMessageType.total = action.payload.pager.total
            replaceMessageType.unread = action.nrOfUnread
            replaceMessageType.page = action.payload.pager.page
            replaceMessageType.loading = false
            messageTypes.splice( [_.findIndex(messageTypes, { 'id': replaceMessageType.id })], 1, replaceMessageType)

            const prevStateConversations = state.messageConversations[replaceMessageType.id]
            const replaceConversations = replaceMessageType.page == 1 ? action.payload.messageConversations :  _.unionWith( prevStateConversations, action.payload.messageConversations, _.isEqual )

            const setSelectedMessageType = action.selectedMessageType == replaceMessageType.id;
            let selectedMessageConversation =  _.find(replaceConversations, { id: action.selectedId })

            return {
                ...state,
                messageTypes: messageTypes,
                messageConversations: {
                    ...state.messageConversations,
                    [replaceMessageType.id]: replaceConversations,
                },
                selectedMessageConversation: setSelectedMessageType ? selectedMessageConversation : state.selectedMessageConversation,
                selectedMessageType: setSelectedMessageType ? replaceMessageType : state.selectedMessageType,
            };
        
        case actions.MESSAGE_CONVERSATION_UPDATE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.MESSAGE_CONVERSATION_UPDATE_SUCCESS:
            let snackMessage = ''
            switch (action.payload.identifier) {
                case 'STATUS':
                    snackMessage = 'Successfully updated status'
                    break;
                case 'PRIORITY':
                    snackMessage = 'Successfully updated priority'
                    break;
                case 'ASSIGNEE':
                    snackMessage = 'Successfully updated assignee'
                    break;
            }

            return {
                ...state,
                snackMessage: snackMessage,
                snackType: POSITIVE,
            }
        
        case actions.MESSAGE_CONVERSATION_DELETE_ERROR:
            return {
                ...state,
                snackMessage: action.payload.error.message,
                snackType: NEGATIVE,
            }

        case actions.MESSAGE_CONVERSATION_DELETE_SUCCESS:
            return {
                ...state,
                snackMessage: 'Successfully deleted message conversation',
                snackType: POSITIVE,
            }

        case actions.CLEAR_SNACK_MESSAGE:
            return {
                ...state,
                snackMessage: '',
                snackType: NEUTRAL,
            }

        /*case actions.MESSAGE_CONVERSATIONS_UPDATE_SUCCESS:
            let updateMessageType = action.messageConversations[0].messageType
            let messageConversations = state.messageConversations[updateMessageType]

            action.messageConversations.map( messageConversation => {
                messageConversations.splice( [_.findIndex(messageConversations, { 'id': messageConversation.id })], 1, messageConversation )
            })

            return {
                ...state,
                messageConversations: {
                    ...state.messageConversations,
                    [updateMessageType]: messageConversations
                },
            };*/
        
        case actions.SET_SELECTED_VALUE:
            let messageConversation = action.payload.messageConversation

            messageConversation.selectedValue = action.payload.selectedValue;
            let selectedIds = state.selectedIds != undefined ? state.selectedIds : []
            if ( action.payload.selectedValue ) {
                selectedIds.push( { 'id' : messageConversation.id } )
            } else {
                selectedIds = _.filter(selectedIds, { 'id' : messageConversation.id});
            }

            return {
                ...state,
                selectedIds: selectedIds,
            };
        
        case actions.SET_SELECTED_MESSAGE_CONVERSATION:
            return {
                ...state,
                selectedMessageConversation: action.payload.messageConversation
            }

        case actions.SET_SELECTED_MESSAGE_TYPE:
            return {
                ...state,
                selectedIds: [],
                selectedMessageType: _.find(state.messageTypes, { id: action.payload.messageTypeId }),
                selectedMessageConversations: state.messageConversations[action.payload.messageTypeId]
            }
        
        case actions.SET_MESSAGE_FILTER:
            return {
                ...state,
                messsageFilter: action.payload.messageFilter
            };
        
        case actions.MESSAGE_TYPE_LOADING:
            messageType.loading = true

            messageTypes.splice( [_.findIndex(messageTypes, { 'id': action.messageType })], 1, messageType)
            return {
                ...state,
                messageTypes: messageTypes,
            };

        case actions.MESSAGE_TYPE_LOADED:
            messageType.loading = false

            messageTypes.splice( [_.findIndex(messageTypes, { 'id': action.messageType })], 1, messageType)
            return {
                ...state,
                messageTypes: messageTypes,
            };
        
        default:
            return state;
    }
}

export default messageReducer;