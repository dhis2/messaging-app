import { pageSize } from '../constants/development.js'
import createRecipientSearchQuery from '../utils/createRecipientSearchQuery.js'

const initialMessageConversationFields = [
    'id',
    'displayName',
    'subject',
    'messageType',
    'lastSender[id, displayName]',
    'assignee[id, displayName]',
    'status',
    'priority',
    'lastUpdated',
    'read',
    'lastMessage',
    'followUp',
]

const messageConversationFields = [
    '*',
    'assignee[id, displayName]',
    'messages[*,sender[id,displayName]',
    'attachments[id, name, contentLength]]',
    'userMessages[user[id, displayName]]',
]

const order = 'lastMessage:desc'

// The rest of the code in this module will expect that
// engine has been set and can use it safely
let engine = null
export const setEngine = engineInstance => {
    engine = engineInstance
}

export const getCurrentUser = () =>
    engine.query({
        currentUser: {
            resource: 'me',
            params: {
                fields: ['id', 'authorities', 'userGroups[id]'],
            },
        },
    })

export const getMessageConversations = async ({
    messageType,
    page,
    messageFilter,
    status,
    priority,
    assignedToMeFilter,
    markedForFollowUpFilter,
    unreadFilter,
    currentUser,
}) => {
    const filter = [`messageType:eq:${messageType}`]

    if (status) {
        filter.push(`status:eq:${status}`)
    }
    if (priority) {
        filter.push(`priority:eq:${priority}`)
    }
    if (markedForFollowUpFilter) {
        filter.push('followUp:eq:true')
    }
    if (unreadFilter) {
        filter.push('read:eq:false')
    }
    if (assignedToMeFilter) {
        filter.push(`assignee.id:eq:${currentUser.id}`)
    }

    const query = {
        resource: 'messageConversations',
        params: {
            filter,
            pageSize,
            page,
            fields: initialMessageConversationFields,
            order,
            queryString: messageFilter,
        },
    }

    const { messageConversations } = await engine.query({
        messageConversations: query,
    })

    return messageConversations
}

export const getMessageConversation = async ({ id }) => {
    const { messageConversation } = await engine.query({
        messageConversation: {
            resource: 'messageConversations',
            id,
            params: { fields: messageConversationFields },
        },
    })

    return messageConversation
}

export const getServerDate = async () => {
    const { systemInfo } = await engine.query({
        systemInfo: {
            resource: 'system/info',
        },
    })

    return systemInfo.serverDate
}

export const updateMessageConversationStatus = (messageConversationId, value) =>
    engine.mutate({
        resource: `messageConversations/${messageConversationId}/status`,
        type: 'create',
        params: {
            messageConversationStatus: value,
        },
    })

export const updateMessageConversationPriority = (
    messageConversationId,
    value
) =>
    engine.mutate({
        resource: `messageConversations/${messageConversationId}/priority`,
        type: 'create',
        params: {
            messageConversationPriority: value,
        },
    })

export const updateMessageConversationAssignee = async (
    messageConversationId,
    value
) => {
    const mutation = value
        ? {
              resource: `messageConversations/${messageConversationId}/assign`,
              type: 'create',
              params: {
                  userId: value,
              },
          }
        : {
              resource: `messageConversations`,
              id: `${messageConversationId}/assign`,
              type: 'delete',
          }

    return await engine.mutate(mutation)
}

export const updateMessageConversationFollowup = (
    messageConversationIds,
    value
) =>
    engine.mutate({
        resource: `messageConversations/${value ? 'followup' : 'unfollowup'}`,
        type: 'create',
        data: messageConversationIds,
    })

export const getNrOfUnread = async messageType => {
    const { messageConversations } = await engine.query({
        messageConversations: {
            resource: 'messageConversations',
            params: {
                fields: ['read'],
                filter: ['read:eq:false', `messageType:eq:${messageType}`],
                pageSize: 1,
            },
        },
    })

    return messageConversations.pager.total
}

export const sendMessage = ({
    subject,
    users,
    userGroups,
    organisationUnits,
    text,
    attachments,
}) =>
    engine.mutate({
        resource: 'messageConversations',
        type: 'create',
        data: {
            subject,
            users,
            userGroups,
            organisationUnits,
            text,
            attachments,
        },
    })

export const sendFeedbackMessage = (subject, text) =>
    engine.mutate({
        resource: 'messageConversations/feedback',
        type: 'create',
        params: { subject },
        data: text,
    })

export const replyMessage = async ({
    message,
    internalReply,
    attachments,
    id,
}) => {
    const params = { internal: internalReply }

    if (attachments.length > 0) {
        params.attachments = attachments
    }

    return await engine.mutate({
        resource: `messageConversations/${id}`,
        type: 'create',
        params,
        data: message,
    })
}

export const deleteMessageConversation = (
    messageConversationId,
    currentUserId
) =>
    engine.mutate({
        resource: `messageConversations/${messageConversationId}/${currentUserId}`,
        type: 'delete',
    })

export const markRead = markedReadConversations =>
    engine.mutate({
        resource: 'messageConversations/read',
        type: 'create',
        data: markedReadConversations,
    })

export const markUnread = markedUnreadConversations =>
    engine.mutate({
        resource: 'messageConversations/unread',
        type: 'create',
        data: markedUnreadConversations,
    })

export const isInFeedbackRecipientGroup = async currentUser => {
    const {
        configuration: { feedbackRecipients },
    } = await engine.query({
        configuration: {
            resource: 'configuration',
        },
    })
    const authorized =
        currentUser.authorities.includes('ALL') ||
        currentUser.userGroups.some(({ id }) => id === feedbackRecipients.id)
    const feedbackRecipientsId = feedbackRecipients.id

    return { authorized, feedbackRecipientsId }
}

export const searchRecipients = async ({
    searchValue,
    searchOnlyUsers,
    searchOnlyFeedbackRecipients,
    feedbackRecipientsId,
    dhis2CoreVersion,
}) => {
    const query = createRecipientSearchQuery({
        searchValue,
        searchOnlyUsers,
        searchOnlyFeedbackRecipients,
        feedbackRecipientsId,
        dhis2CoreVersion,
    })

    const results = await engine.query(query)

    return {
        users: results.users?.users,
        organisationUnits: results?.organisationUnits?.organisationUnits,
        userGroups: results?.userGroups?.userGroups,
    }
}

export const addRecipients = ({
    users,
    userGroups,
    organisationUnits,
    messageConversationId,
}) =>
    engine.mutate({
        resource: `messageConversations/${messageConversationId}/recipients`,
        type: 'create',
        data: {
            users,
            userGroups,
            organisationUnits,
        },
    })

export const getUserById = async id => {
    const { user } = await engine.query({
        user: {
            resource: 'users',
            id,
            params: {
                fields: 'id,displayName',
            },
        },
    })

    return {
        ...user,
        type: 'user',
    }
}

export const addAttachment = attachment =>
    engine.mutate({
        resource: 'fileResources',
        type: 'create',
        params: {
            domain: 'MESSAGE_ATTACHMENT',
        },
        data: {
            file: attachment,
        },
    })

export const downloadAttachment = (
    messageConversationId,
    messageId,
    attachmentId
) => {
    const filePath = [
        engine.link.baseUrl,
        engine.link.apiPath,
        'messageConversations',
        messageConversationId,
        messageId,
        'attachments',
        attachmentId,
    ].join('/')

    const link = document.createElement('a')
    link.href = filePath
    link.download = filePath.split('/').pop()
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
