import * as actions from 'constants/actions';

export const initialState = {
    suggestions: [],

};

function recipientReducer(state = initialState, action) {
    switch (action.type) {
        case actions.RECIPIENT_SEARCH_SUCCESS:
            return {
                ...state,
                suggestions: action.payload.suggestions,
            }
        
        default:
            return state;
    }
}

export default recipientReducer;