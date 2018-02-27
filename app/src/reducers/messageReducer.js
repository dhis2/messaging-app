import * as actions from 'constants/actions';

export const initialState = {
    selectedMessageType: '',
    all: [],
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        case actions.TOGGLE_MESSAGE_TYPE:
            return {
                ...state,
                selectedMessageType: action.payload.messageType.key,
            };

        default:
            return state;
    }
}

export default messageReducer;