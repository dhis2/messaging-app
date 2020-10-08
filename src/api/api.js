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
                fields: ['id', 'authorities'],
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

export const getServerDate = () =>
    getD2Instance()
        .then(instance => instance.Api.getApi().get('system/info'))
        .then(result => result.serverDate)
        .catch(error => {
            throw error
        })

export const updateMessageConversationStatus = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/status?messageConversationStatus=${value}`
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const updateMessageConversationPriority = (
    messageConversationId,
    value
) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/priority?messageConversationPriority=${value}`
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const updateMessageConversationAssignee = (
    messageConversationId,
    value
) =>
    getD2Instance()
        .then(instance =>
            value === undefined
                ? instance.Api.getApi().delete(
                      `messageConversations/${messageConversationId}/assign`
                  )
                : instance.Api.getApi().post(
                      `messageConversations/${messageConversationId}/assign?userId=${value}`
                  )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const updateMessageConversationFollowup = (
    messageConversationIds,
    value
) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${value ? 'followup' : 'unfollowup'}`,
                messageConversationIds
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const getNrOfUnread = messageType =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('messageConversations', {
                fields: 'read',
                filter: ['read:eq:false', `messageType:eq:${messageType}`],
            })
        )
        .then(result => result.pager.total)
        .catch(error => {
            throw error
        })

export const sendMessage = ({
    subject,
    users,
    userGroups,
    organisationUnits,
    text,
    attachments,
}) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations', {
                subject,
                users,
                userGroups,
                organisationUnits,
                attachments,
                text,
            })
        )
        .catch(error => {
            throw error
        })

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

export const deleteMessageConversation = messageConversationId =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().delete(
                `messageConversations/${messageConversationId}/${instance.currentUser.id}`
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const markRead = markedReadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                'messageConversations/read',
                markedReadConversations
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

export const markUnread = markedUnreadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                'messageConversations/unread',
                markedUnreadConversations
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

/* Feedback recipient query */
export const isInFeedbackRecipientGroup = () =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('me', { fields: 'userGroups[id]' })
        )
        .then(result =>
            getD2Instance()
                .then(instance => ({
                    configuration: instance.Api.getApi()
                        .get('configuration')
                        .then(configuration => configuration),
                    instance,
                }))
                .then(({ configuration, instance }) => {
                    const getSymbolProperties = symbol =>
                        Array.from(
                            symbol[Object.getOwnPropertySymbols(symbol)[0]]
                        )

                    const userAuthorities = getSymbolProperties(
                        instance.currentUser.authorities
                    )
                    return configuration.then(configurationResult => ({
                        authorized:
                            userAuthorities.includes('ALL') ||
                            !!result.userGroups.find(
                                group =>
                                    group.id ===
                                    configurationResult.feedbackRecipients.id
                            ),
                        feedbackRecipientsId:
                            configurationResult.feedbackRecipients.id,
                    }))
                })
                .catch(error => {
                    throw error
                })
        )
        .catch(error => {
            throw error
        })

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
