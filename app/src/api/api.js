import { getInstance as getD2Instance } from 'd2/lib/d2'
import { pageSize } from '../constants/development'

const find = require('lodash/find')

const initialMessageConversationFields =
    'id, displayName, subject, messageType, lastSender[id, displayName], assignee[id, displayName], status, priority, lastUpdated, read, lastMessage, followUp'

const messageConversationFields =
    '*,assignee[id, displayName],messages[*,sender[id,displayName],attachments[id, name, contentLength]],userMessages[user[id, displayName]]'

const order = 'lastMessage:desc'
export const getMessageConversations = (
    messageType,
    page,
    messageFilter,
    status,
    priority,
    assignedToMeFilter,
    markedForFollowUpFilter,
    unreadFilter
) => {
    const filters = [`messageType:eq:${messageType}`]
    status != undefined && filters.push(`status:eq:${status}`)
    priority != undefined && filters.push(`priority:eq:${priority}`)
    markedForFollowUpFilter && filters.push('followUp:eq:true')
    unreadFilter && filters.push('read:eq:false')

    return getD2Instance()
        .then(instance => {
            assignedToMeFilter &&
                filters.push(`assignee.id:eq:${instance.currentUser.id}`)

            return instance.Api.getApi().get(
                `messageConversations?pageSize=${pageSize}&page=${page}${
                    messageFilter !== '' && messageFilter !== undefined
                        ? `&queryString=${messageFilter}`
                        : ''
                }`,
                {
                    fields: [initialMessageConversationFields],
                    order,
                    filter: filters,
                }
            )
        })
        .then(result => ({
            messageConversations: result.messageConversations,
            pager: result.pager,
        }))
        .catch(error => {
            throw error
        })
}

export const getMessageConversation = messageConversation =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(
                `messageConversations/${messageConversation.id}`,
                {
                    fields: [messageConversationFields],
                }
            )
        )
        .then(result => result)
        .catch(error => {
            throw error
        })

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
        .then(
            instance =>
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

export const sendMessage = (
    subject,
    users,
    userGroups,
    organisationUnits,
    text,
    attachments,
    id
) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations', {
                id,
                subject,
                users,
                userGroups,
                organisationUnits,
                attachments,
                text,
            })
        )
        .then(() => ({ messageConversationId: id }))
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

export const replyMessage = (message, internalReply, attachments, id) =>
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
                `messageConversations/${messageConversationId}/${
                    instance.currentUser.id
                }`
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
                            find(result.userGroups, {
                                id: configurationResult.feedbackRecipients.id,
                            }) !== undefined || userAuthorities.includes('ALL'),
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

export const searchRecipients = (
    searchValue,
    searchOnlyUsers,
    searchOnlyFeedbackRecipients,
    feedbackRecipientsId
) => {
    const filters = [`displayName:token:${searchValue}`]
    searchOnlyFeedbackRecipients &&
        filters.push(`userGroups.id:eq:${feedbackRecipientsId}`)

    return getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('users', {
                pageSize: MAX_RECIPIENT,
                filter: filters,
            })
        )
        .then(
            ({ users }) =>
                searchOnlyUsers
                    ? { users, undefined, undefined }
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

export const addRecipients = (
    users,
    userGroups,
    organisationUnits,
    messageConversationId
) =>
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

export function createAttachment(attachment) {
    let form = new FormData()
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

export function createBlob(contents, format, compression) {
    return URL.createObjectURL(
        new Blob([contents], { type: blobType(format, compression) })
    )
}

export function downloadBlob(url, filename) {
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
