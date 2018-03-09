import { getInstance as getD2Instance } from 'd2/lib/d2';

const order = 'lastMessage:desc';
export const getMessageConversations = messageType =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations', { fields: '*,messages[*,sender[id,displayName]]', order, filter: 'messageType:eq:' + messageType }))
    .then(result => result.messageConversations)
    .catch(error => {
      throw error;
    });

export const markRead = markedReadConversations =>
  getD2Instance()
    .then(console.log("markRead"))
    .then(instance =>
      instance.Api.getApi().post('messageConversations/read', { test: markedReadConversations } ))
    .catch(error => {
      throw error;
    });

export const markUnread = markedUnreadConversations =>
  getD2Instance()
    .then(instance =>
      instance.Api.getApi().post('messageConversations/unread', { markedReadConversations } ))
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
