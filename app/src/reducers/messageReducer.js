import * as actions from 'constants/actions';

export const initialState = {
    messageConversations: {},
    usersCache: [],
    loaded: false,
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS:
            return {
                ...state,
                messageConversations: {
                    ...state.messageConversations,
                    [action.messageType]: action.payload.messageConversations
                },
            };
        
        case actions.MESSAGE_CONVERSATIONS_LOAD_FINISHED:
            return {
                ...state,
                loaded: true,
            }
        
        default:
            return state;
    }
}

export default messageReducer;