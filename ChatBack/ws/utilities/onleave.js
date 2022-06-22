const ChatService = require('../../src/services/chat.service');
const { sendForClient } = require('../helpers/send.methods');
const onLeaveEvent = async (server, userId) => {
    const { chats } = await ChatService.getChats({ userId });
    const message = {
        userId: userId,
        event: 'wentOffline',
    };
    if (chats.length == 0) return;
    for (let client of server.clients) {
        for (let chat of chats) {
            if (client.userId == chat.toUser.userId) {
                sendForClient(client, message);
            }
        }
    }
};

module.exports = onLeaveEvent;
