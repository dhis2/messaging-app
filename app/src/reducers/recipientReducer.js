import * as actions from 'constants/actions';

export const initialState = {
    suggestions: [],
    selected: [],
};

function recipientReducer(state = initialState, action) {
    switch (action.type) {
        case actions.RECIPIENT_SEARCH_SUCCESS:
            return {
                ...state,
                suggestions: action.payload.suggestions,
            }
        
        case actions.SET_SELECTED:
            return {
                ...state,
                selected: action.payload.selectedList,
            }
        
        default:
            return state;
    }
}

export default recipientReducer;