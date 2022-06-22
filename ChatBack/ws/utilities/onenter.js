const ChatService = require('../../src/services/chat.service');
const { sendForClient } = require('../helpers/send.methods');
const onConnectionEvent = async (server, myClient, userId) => {
    const { chats } = await ChatService.getChats({ userId });
    const message = {
        userId: userId,
        event: 'becomeOnline',
    };
    if (chats.length != 0) {
        for (let client of server.clients) {
            for (let chat of chats) {
                if (client.userId == chat.toUser.userId) {
                    chats.online = true;
                    sendForClient(client, message);
                }
            }
        }
    }
    const myMessage = { chats: chats, event: 'onlineUsers' };
    sendForClient(myClient, myMessage);
};

module.exports = onConnectionEvent;
