const { getMessage } = require('../../src/services/message.service');
const MessageService = require('../../src/services/message.service');

const {
    sendForClientWithId,
    sendForClient,
} = require('../helpers/send.methods');

const events = {
    sendMessage: {
        func: async (data) => {
            await MessageService.createMessage(data);
            const message = getMessage(data);
            return { message };
        },
        response: ({ server, clientId, result }) => {
            const message = { ...result, event: 'newMessage' };
            sendForClientWithId(server, clientId, message);
        },
    },
    deleteMessages: {
        func: async (data) => {
            await MessageService.deleteMessagesForBoth(data);
            return { deletedMessages: data.messagesId };
        },
        response: ({ server, clientId, result }) => {
            const message = { ...result, event: 'deletedMessages' };
            sendForClientWithId(server, clientId, message);
        },
    },
    editMessage: {
        func: async (data) => {
            await MessageService.updateMessage(data);
            const message = getMessage(data);
            return { message };
        },
        response: ({ server, clientId, result }) => {
            const message = { ...result, event: 'editedMessage' };
            sendForClientWithId(server, clientId, message);
        },
    },
};

const use = async (server, client, data) => {
    const event = events[data.event];
    if (!event) {
        const message = {
            event: 'eventError',
            message: 'The event was not found!',
        };
        sendForClient(client, message);
        return;
    }

    try {
        const { reciverId, newData } = data?.body || {};
        const result = await event.func({
            ...newData,
            userId: client.userId,
        });
        event.response({ server, client, reciverId, result });
    } catch (err) {
        const message = {
            event: 'serverError',
            message: 'Something happened!',
        };
        sendForClient(client, message);
    }
};

module.exports = use;
