import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';

import messageReducer from 'reducers/messageReducer';
import Epics from 'actions/epics';
import recipientReducer from './reducers/recipientReducer';

const middlewares = [createEpicMiddleware(Epics)];

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
}

const reducer = combineReducers({
    messaging: messageReducer,
    recipient: recipientReducer,
});

export default createStore(reducer, composeEnhancers(applyMiddleware(...middlewares)));