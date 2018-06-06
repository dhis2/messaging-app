import { getInstance as getD2Instance } from 'd2/lib/d2';
import MessageConversation from '../components/MessageConversation';
import { pageSize } from '../constants/development';

const initialMessageConversationFields =
    'id, displayName, subject, messageType, lastSender[id, displayName], assignee[id, displayName], status, priority, lastUpdated, read, lastMessage';

const messageConversationFields =
    '*,assignee[id, displayName],messages[*,sender[id,displayName]],userMessages[user[id, displayName]]';

const order = 'lastMessage:desc';
export const getMessageConversations = (messageType, page, messageFilter, status, priority) => {
    let filters = [`messageType:eq:${messageType}`];
    status != null && filters.push(`status:eq:${status}`);
    priority != null && filters.push(`priority:eq:${priority}`);

    return getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(
                `messageConversations?pageSize=${pageSize}&page=${page}` +
                    (messageFilter != '' && messageFilter != undefined
                        ? `&queryString=${messageFilter}`
                        : ''),
                {
                    fields: [initialMessageConversationFields],
                    order,
                    filter: filters,
                },
            ),
        )
        .then(result => ({
            messageConversations: result.messageConversations,
            pager: result.pager,
        }))
        .catch(error => {
            throw error;
        });
};

export const getMessageConversation = messageConversation => {
    return getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`messageConversations/${messageConversation.id}`, {
                fields: [messageConversationFields],
            }),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });
};

export const updateMessageConversationStatus = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/status?messageConversationStatus=${value}`,
            ),
        )
        .catch(error => {
            throw error;
        });

export const updateMessageConversationPriority = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/priority?messageConversationPriority=${value}`,
            ),
        )
        .catch(error => {
            throw error;
        });

export const updateMessageConversationAssignee = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/assign?userId=${value}`,
            ),
        )
        .catch(error => {
            throw error;
        });

export const getNrOfUnread = messageType =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('messageConversations', {
                fields: 'read',
                filter: ['read:eq:false', 'messageType:eq:' + messageType],
            }),
        )
        .then(result => result.pager.total)
        .catch(error => {
            throw error;
        });

export const sendMessage = (subject, users, userGroups, organisationUnits, text, id) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations', {
                id,
                subject,
                users,
                userGroups,
                organisationUnits,
                text,
            }),
        )
        .then(() => ({ messageConversationId: id }))
        .catch(error => {
            throw error;
        });

export const sendFeedbackMessage = (subject, text) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(`messageConversations/feedback?subject=${subject}`, text, {
                headers: { 'Content-Type': 'text/plain' },
            }),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

export const replyMessage = (message, internalReply, messageConversationId) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}?internal=${internalReply}`,
                message,
                {
                    headers: { 'Content-Type': 'text/plain' },
                },
            ),
        )
        .catch(error => {
            throw error;
        });

export const deleteMessageConversation = messageConversationId =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().delete(
                `messageConversations/${messageConversationId}/${instance.currentUser.id}`,
            ),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

export const markRead = markedReadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations/read', markedReadConversations),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

export const markUnread = markedUnreadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations/unread', markedUnreadConversations),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

const MAX_RECIPIENT = 10;
const searchOrganisationUnits = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`organisationUnits`, {
                fields: 'id, displayName',
                pageSize: MAX_RECIPIENT,
                filter: [`displayName:token:${searchValue}`, 'users:gte:1'],
            }),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

/* Feedback recipient query */

export const isInFeedbackRecipientGroup = () =>
    getD2Instance()
        .then(instance => instance.Api.getApi().get(`me`, { fields: 'userGroups[id]' }))
        .then(result =>
            getD2Instance()
                .then(instance => instance.Api.getApi().get(`configuration`))
                .then(
                    configuration =>
                        _.find(result.userGroups, { id: configuration.feedbackRecipients.id }) !=
                        undefined,
                )
                .catch(error => {
                    throw error;
                }),
        )
        .catch(error => {
            throw error;
        });

/* Recipient search */
export const searchRecipients = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`sharing/search?key=${searchValue}`, {
                pageSize: MAX_RECIPIENT,
                filter: ['users:gte:1'],
            }),
        )
        .then(result =>
            searchOrganisationUnits(searchValue).then(({ organisationUnits }) => ({
                users: result.users,
                userGroups: result.userGroups,
                organisationUnits: organisationUnits,
            })),
        )
        .catch(error => {
            throw error;
        });

export const fetchParticipants = messageConversationId =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`messageConversations/${messageConversationId}`, {
                fields: 'userMessages[user[id, displayName]]',
            }),
        )
        .then(result => result)
        .catch(error => {
            throw error;
        });

export const addRecipients = (users, userGroups, organisationUnits, messageConversationId) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(`messageConversations/${messageConversationId}/recipients`, {
                users,
                userGroups,
                organisationUnits,
            }),
        )
        .catch(error => {
            throw error;
        });
