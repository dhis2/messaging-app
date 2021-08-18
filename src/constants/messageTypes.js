import i18n from '@dhis2/d2-i18n'

const messageTypes = [
    {
        id: 'PRIVATE',
        displayName: i18n.t('Inbox'),
        unread: 0,
        loaded: 0,
        loading: false,
        total: 0,
        page: 1,
    },
    {
        id: 'VALIDATION_RESULT',
        displayName: i18n.t('Validation'),
        unread: 0,
        loaded: 0,
        loading: false,
        total: 0,
        page: 1,
    },
    {
        id: 'TICKET',
        displayName: i18n.t('Ticket'),
        unread: 0,
        loaded: 0,
        loading: false,
        total: 0,
        page: 1,
    },
    {
        id: 'SYSTEM',
        displayName: i18n.t('System'),
        unread: 0,
        loaded: 0,
        loading: false,
        total: 0,
        page: 1,
    },
]

export default messageTypes
