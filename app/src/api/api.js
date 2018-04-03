import { getInstance as getD2Instance } from 'd2/lib/d2';
import MessageConversation from '../components/MessageConversation';

const messageConversationFields = '*,assignee[id, displayName],messages[*,sender[id,displayName]],userMessages[user[id, displayName]]'
export const getMessageConversationsWithIds = messageConversationIds =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations', { fields: messageConversationFields, filter: 'id:in:[' + messageConversationIds + ']' }))
    .then(result => result)
    .catch(error => {
      throw new Error(error);
    });

const order = 'lastMessage:desc';
export const getMessageConversations = (messageType, page) =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations?pageSize=10&page=' + page, { fields: [messageConversationFields], order, filter: 'messageType:eq:' + messageType }))
    .then(result => ({ messageConversations: result.messageConversations, pager: result.pager}))
    .catch(error => {
      throw new Error(error);
    });

export const updateMessageConversationStatus = (messageConversation) => 
    getD2Instance()
      .then(instance => instance.Api.getApi().post(`messageConversations/${messageConversation.id}/status?messageConversationStatus=${messageConversation.status}`))
      .catch(error => {
        throw new Error(error);
      });

export const updateMessageConversationPriority = (messageConversation) => 
    getD2Instance()
      .then(instance => instance.Api.getApi().post(`messageConversations/${messageConversation.id}/priority?messageConversationPriority=${messageConversation.priority}`))
      .catch(error => {
        throw new Error(error);
      });

export const updateMessageConversationAssignee = (messageConversation) => 
    getD2Instance()
      .then(instance => instance.Api.getApi().post(`messageConversations/${messageConversation.id}/assign?userId=${messageConversation.assignee.id}`))
      .catch(error => {
        throw error;
      });

export const getNrOfUnread = messageType =>
    getD2Instance()
      .then(instance => instance.Api.getApi().get('messageConversations', { fields: 'read', filter: ['read:eq:false', 'messageType:eq:' + messageType] }))
      .then(result => result.pager.total)
      .catch(error => {
        throw new Error(error);
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
        throw new Error(error);
      });

export const replyMessage = (message, messageConversationId) =>
    getD2Instance()
      .then(instance =>
        instance.Api.getApi().post('messageConversations/' + messageConversationId, message, { headers: {"Content-Type": "text/plain"} }))
      .catch(error => {
        throw new Error(error);
      });

export const deleteMessageConversation = messageConversationId =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().delete(`messageConversations/${messageConversationId}`))
    .then(result => result)
    .catch(error => {
      throw new Error(error);
    });

export const markRead = markedReadConversations =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().post('messageConversations/read', markedReadConversations))
    .then(result => result)
    .catch(error => {
      throw new Error(error);
    });

export const markUnread = markedUnreadConversations =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().post('messageConversations/unread', markedUnreadConversations ))
    .then(result => result)
    .catch(error => {
      throw new Error(error);
    });

/* Recipient search */
const MAX_RECIPIENT = 10;
export const getUsers = searchValue =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('users', { fields: 'id, displayName', filter: 'displayName:token:' + searchValue, pageSize: MAX_RECIPIENT }))
    .then(result => result.users)
    .catch(error => {
      throw new Error(error);
    });
