import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import messageReducer from './reducers/messageReducer'

const middlewares = [ReduxThunk]

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger())
}

const reducer = combineReducers({
    messaging: messageReducer,
})

export default createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
)
