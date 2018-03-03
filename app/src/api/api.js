import { getInstance as getD2Instance } from 'd2/lib/d2';

export const getMessageConversations = messageType =>
  getD2Instance()
    .then(instance => instance.Api.getApi().get('messageConversations', { fields: '*,messages[*]', filter: 'messageType:eq:' + messageType }))
    .then(result => result.messageConversations)
    .catch(error => {
      throw error;
    });