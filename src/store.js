import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import messageReducer from './reducers/messageReducer.js'

const middlewares = [ReduxThunk]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducer = combineReducers({
    messaging: messageReducer,
})

export default createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
)
