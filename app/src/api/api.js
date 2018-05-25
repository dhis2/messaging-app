import { getInstance as getD2Instance } from 'd2/lib/d2';
import MessageConversation from '../components/MessageConversation';
import { pageSize } from '../constants/development';

const messageConversationFields =
    '*,assignee[id, displayName],messages[*,sender[id,displayName]],userMessages[user[id, displayName]]';
export const getMessageConversationsWithIds = messageConversationIds =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get('messageConversations', {
                fields: messageConversationFields,
                filter: 'id:in:[' + messageConversationIds + ']',
            }),
        )
        .then(result => result)
        .catch(error => {
            throw new Error(error);
        });

const order = 'lastMessage:desc';
export const getMessageConversations = (messageType, page, messageFilter) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(
                `messageConversations?pageSize=${pageSize}&page=${page}` +
                    (messageFilter != '' && messageFilter != undefined
                        ? `&queryString=${messageFilter}`
                        : ''),
                {
                    fields: [messageConversationFields],
                    order,
                    filter: `messageType:eq:${messageType}`,
                },
            ),
        )
        .then(result => ({
            messageConversations: result.messageConversations,
            pager: result.pager,
        }))
        .catch(error => {
            throw new Error(error);
        });

export const updateMessageConversationStatus = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/status?messageConversationStatus=${value}`,
            ),
        )
        .catch(error => {
            throw new Error(error);
        });

export const updateMessageConversationPriority = (messageConversationId, value) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/priority?messageConversationPriority=${value}`,
            ),
        )
        .catch(error => {
            throw new Error(error);
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
            throw new Error(error);
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
            throw new Error(error);
        });

export const replyMessage = (message, messageConversationId) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations/' + messageConversationId, message, {
                headers: { 'Content-Type': 'text/plain' },
            }),
        )
        .catch(error => {
            throw new Error(error);
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
            throw new Error(error);
        });

export const markRead = markedReadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations/read', markedReadConversations),
        )
        .then(result => result)
        .catch(error => {
            throw new Error(error);
        });

export const markUnread = markedUnreadConversations =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post('messageConversations/unread', markedUnreadConversations),
        )
        .then(result => result)
        .catch(error => {
            throw new Error(error);
        });

const MAX_RECIPIENT = 10;
const searchOrganisationUnits = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`organisationUnits`, {
                fields: 'id, displayName',
                pageSize: MAX_RECIPIENT,
                filter: [`displayName:token:${searchValue}`],
            }),
        )
        .then(result => result)
        .catch(error => {
            throw new Error(error);
        });

/* Recipient search */
export const searchRecipients = searchValue =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().get(`sharing/search?key=${searchValue}`, {
                pageSize: MAX_RECIPIENT,
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
            throw new Error(error);
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
            throw new Error(error);
        });

export const addRecipients = (users, userGroups, organisationUnits, messageConversationId) =>
    getD2Instance()
        .then(instance =>
            instance.Api.getApi().post(
                `messageConversations/${messageConversationId}/addRecipients`,
                {
                    users,
                    userGroups,
                    organisationUnits,
                },
            ),
        )
        .catch(error => {
            throw new Error(error);
        });
