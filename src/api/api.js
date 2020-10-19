import { getInstance as getD2Instance } from 'd2'
import { pageSize } from '../constants/development'
import { supportsUserLookupEndPoint } from '../utils/helpers.js'

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

export const getCurrentUser = () => {
    return engine.query({
        currentUser: {
            resource: 'me',
            params: {
                fields: ['id', 'authorities', 'userGroups[id]'],
            },
        },
    })
}

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
        },
    }

    if (messageFilter) {
        query.params.queryString = messageFilter
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

export const updateMessageConversationStatus = async (
    messageConversationId,
    value
) => {
    return await engine.mutate({
        resource: `messageConversations/${messageConversationId}/status`,
        type: 'create',
        params: {
            messageConversationStatus: value,
        },
    })
}

export const updateMessageConversationPriority = async (
    messageConversationId,
    value
) =>
    await engine.mutate({
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

export const updateMessageConversationFollowup = async (
    messageConversationIds,
    value
) => {
    return await engine.mutate({
        resource: `messageConversations/${value ? 'followup' : 'unfollowup'}`,
        type: 'create',
        data: messageConversationIds,
    })
}

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

export const sendMessage = async ({
    subject,
    users,
    userGroups,
    organisationUnits,
    text,
    attachments,
}) =>
    await engine.mutate({
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

// The data engine currently doesn't support "text/plain" Content-Type
// https://github.com/dhis2/app-runtime/pull/651
export const sendFeedbackMessage = (subject, text) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/feedback?subject=${subject}`,
                text,
                {
                    headers: { 'Content-Type': 'text/plain' },
                }
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

// The data engine currently doesn't support "text/plain" Content-Type
// https://github.com/dhis2/app-runtime/pull/651
export const replyMessage = ({ message, internalReply, attachments, id }) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${id}?internal=${internalReply}${
                    attachments.length > 0 ? `&attachments=${attachments}` : ''
                }`,
                message,
                {
                    headers: { 'Content-Type': 'text/plain' },
                }
            )
        )
        .catch(error => {
            throw error
        })

export const deleteMessageConversation = async (
    messageConversationId,
    currentUserId
) =>
    await engine.mutate({
        resource: `messageConversations/${messageConversationId}/${currentUserId}`,
        type: 'delete',
    })

export const markRead = async markedReadConversations =>
    await engine.mutate({
        resource: 'messageConversations/read',
        type: 'create',
        data: markedReadConversations,
    })

export const markUnread = async markedUnreadConversations =>
    await engine.mutate({
        resource: 'messageConversations/unread',
        type: 'create',
        data: markedUnreadConversations,
    })

/* Feedback recipient query */
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

/* Recipient search */
const MAX_RECIPIENT = 10
const searchOrganisationUnits = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('organisationUnits', {
                fields: 'id, displayName',
                pageSize: MAX_RECIPIENT,
                filter: [`displayName:token:${searchValue}`, 'users:gte:1'],
            })
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

const searchUserGroups = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('userGroups', {
                fields: 'id, displayName',
                pageSize: MAX_RECIPIENT,
                filter: [`displayName:token:${searchValue}`],
            })
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const searchRecipients = ({
    searchValue,
    searchOnlyUsers,
    searchOnlyFeedbackRecipients,
    feedbackRecipientsId,
}) => {
    return getD2Instance()
        .then(instance => {
            if (supportsUserLookupEndPoint(instance.system.version.minor)) {
                // version >= v2.35
                const url = searchOnlyFeedbackRecipients
                    ? 'userLookup/feedbackRecipients'
                    : 'userLookup'

                return instance.Api.getApi().get(`${url}?query=${searchValue}`)
            } else {
                // version < 2.35
                const filters = [`displayName:token:${searchValue}`]
                if (searchOnlyFeedbackRecipients) {
                    filters.push(`userGroups.id:eq:${feedbackRecipientsId}`)
                }

                return instance.Api.getApi().get('users', {
                    pageSize: MAX_RECIPIENT,
                    filter: filters,
                })
            }
        })
        .then(({ users }) =>
            searchOnlyUsers
                ? { users, undefined }
                : searchUserGroups(searchValue).then(({ userGroups }) =>
                      searchOrganisationUnits(searchValue).then(
                          ({ organisationUnits }) => ({
                              users,
                              userGroups,
                              organisationUnits,
                          })
                      )
                  )
        )
        .catch(error => {
            throw error
        })
}

export const fetchParticipants = messageConversationId =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(
                `messageConversations/${messageConversationId}`,
                {
                    fields: 'userMessages[user[id, displayName]]',
                }
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const addRecipients = ({
    users,
    userGroups,
    organisationUnits,
    messageConversationId,
}) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/recipients`,
                {
                    users,
                    userGroups,
                    organisationUnits,
                }
            )
        )
        .catch(error => {
            throw error
        })

export const getUserById = id =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`users/${id}`, {
                fields: 'id,displayName',
            })
        )
        .then(({ id, displayName }) => ({
            id,
            displayName,
            type: 'user',
        }))
        .catch(error => {
            throw error
        })

export function createAttachment(attachment) {
    const form = new FormData()
    form.append('file', attachment)
    return form
}

export const addAttachment = attachment =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                '/fileResources?domain=MESSAGE_ATTACHMENT',
                createAttachment(attachment)
            )
        )
        .catch(error => {
            throw error
        })

export function downloadBlob(url) {
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
}

export const downloadAttachment = (
    messageConversationId,
    messageId,
    attachmentId
) =>
    getD2Instance()
        .then(instance => {
            const baseUrl = instance.Api.getApi().baseUrl
            return downloadBlob(
                `${baseUrl}/messageConversations/${messageConversationId}/${messageId}/attachments/${attachmentId}`
            )
        })
        .catch(error => {
            throw error
        })
