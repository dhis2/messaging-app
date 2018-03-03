import * as actions from 'constants/actions';

export const initialState = {
    messageConversations: [],
    loaded: false,
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS:
            return {
                ...state,
                messageConversations: action.payload.messageConversations,
                loaded: true,
            };
        
        default:
            return state;
    }
}

export default messageReducer;