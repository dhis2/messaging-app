import * as actions from 'constants/actions';

export const initialState = {
    selectedMessageType: '',
    all: [],
};

function messageReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default messageReducer;