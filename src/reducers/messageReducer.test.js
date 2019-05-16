import messageReducer, { initialState } from './messageReducer'
import * as actions from '../constants/actions'
import { findIndexOfId } from '../utils/helpers'

describe('message conversation reducer', () => {
    it('should return the default state', () => {
        const actualState = messageReducer(undefined, {})

        expect(actualState).toEqual(initialState)
    })

    it('should handle MESSAGE_CONVERSATIONS_LOAD_SUCCESS', () => {
        const messageConversations = [
            { id: 'id1', displayName: 'id1', messageType: 'VALIDATION_RESULT' },
            { id: 'id2', displayName: 'id2', messageType: 'VALIDATION_RESULT' },
        ]

        const action = {
            type: actions.MESSAGE_CONVERSATIONS_LOAD_SUCCESS,
            payload: {
                messageConversations,
                pager: {
                    page: 1,
                    pageCount: 1,
                    pageSize: 25,
                    total: 4,
                },
                messageType: {
                    displayName: 'Validation',
                    id: 'VALIDATION_RESULT',
                },
                selectedMessageType: {
                    ...initialState.messageTypes['VALIDATION_RESULT'],
                },
                nrOfUnread: 2,
            },
        }

        const expectedState = {
            ...initialState,
            messageConversations: {
                VALIDATION_RESULT: messageConversations,
            },
        }

        const actualState = messageReducer(initialState, action)
        expect(actualState).toEqual(expectedState)
    })

    it('should handle SEND_MESSAGE_ERROR', () => {
        const action = {
            type: actions.SEND_MESSAGE_ERROR,
            payload: {
                error: {
                    message: 'error message',
                },
            },
        }

        const expectedState = {
            ...initialState,
            snackMessage: 'error message',
            snackType: 'NEGATIVE',
        }

        const actualState = messageReducer(initialState, action)
        expect(actualState).toEqual(expectedState)
    })

    it('should handle LOAD_MESSAGE_CONVERSATIONS', () => {
        const messageType = {
            id: 'VALIDATION_RESULT',
            loading: false,
        }

        const action = {
            type: actions.LOAD_MESSAGE_CONVERSATIONS,
            payload: {
                messageType,
            },
        }

        const stateMessageTypes = initialState.messageTypes

        const loadingMessageType = messageType
        loadingMessageType.loading = true

        stateMessageTypes[
            findIndexOfId(stateMessageTypes, loadingMessageType)
        ] = loadingMessageType

        const expectedState = {
            ...initialState,
            messageTypes: stateMessageTypes,
        }

        const actualState = messageReducer(initialState, action)
        expect(actualState).toEqual(expectedState)
    })
})
