import { getInstance as getD2Instance } from 'd2/lib/d2';

const messageConversationFields = '*,messages[*,sender[id,displayName]],userMessages[user[id, displayName]]'
export const getMessageConversationsWithIds = messageConversationIds =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations', { fields: messageConversationFields, filter: 'id:in:[' + messageConversationIds + ']' }))
    .then(result => result)
    .catch(error => {
      throw error;
    });

const order = 'lastMessage:desc';
export const getMessageConversations = (messageType, page) =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations?pageSize=50', { fields: [messageConversationFields, 'page=' + page], order, filter: 'messageType:eq:' + messageType }))
    .then(result => ({ messageConversations: result.messageConversations, pager: result.pager}))
    .catch(error => {
      throw error;
    });

export const getNrOfUnread = messageType =>
    getD2Instance()
      .then(instance => instance.Api.getApi().get('messageConversations', { fields: 'read', filter: ['read:eq:false', 'messageType:eq:' + messageType] }))
      .then(result => result.pager.total)
      .catch(error => {
        throw error;
      });

export const sendMessage = (subject, users, text, id) =>
    getD2Instance()
      .then(instance =>
        instance.Api.getApi().post('messageConversations', { 
          id,
          subject,
          users,
          text,
        }))
      .then( () => ({ messageConversationId: id }))
      .catch(error => {
        throw error;
      });

export const replyMessage = (message, messageConversationId) =>
    getD2Instance()
      .then(instance =>
        instance.Api.getApi().post('messageConversations/' + messageConversationId, message, { headers: {"Content-Type": "text/plain"} }))
      .catch(error => {
        throw error;
      });

export const markRead = markedReadConversations =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().post('messageConversations/read', markedReadConversations))
    .catch(error => {
      throw error;
    });

export const markUnread = markedUnreadConversations =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().post('messageConversations/unread', markedUnreadConversations ))
    .catch(error => {
      throw error;
    });

/* Recipient search */
const MAX_RECIPIENT = 10;
export const getUsers = searchValue =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('users', { fields: 'id, displayName', filter: 'displayName:token:' + searchValue, pageSize: MAX_RECIPIENT }))
    .then(result => result.users)
    .catch(error => {
      throw error;
    });
