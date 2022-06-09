const messages = [];

class MessageService {
    static async getMessage({ query, messageId }) {
        const tempMessageId = messageId || query.message_id || undefined;
        return messages[tempMessageId];
    }
}

module.exports = MessageService;
