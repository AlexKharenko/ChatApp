const QueryBuilder = require('../db/querybuilder');
const { C_NF } = require('../errors/error.list');

class MessageService {
    static #TABLE_NAME = 'textmessages';
    static #QUERYBUILDER = new QueryBuilder();
    static #LIMIT = 100;
    static async getMessages({ query }) {
        if (!query.chat_id) throw C_NF;
        try {
            const messages = await MessageService.#QUERYBUILDER.find(
                {
                    table_name: MessageService.#TABLE_NAME,
                    where: [{ column: 'chatId', value: query.chat_id }],
                    offset: query.offset || 0,
                },
                MessageService.#LIMIT
            );
            return { messages };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async createMessage({
        chatId,
        userId,
        body,
        isForwarded,
        forwardedFromUser,
    }) {
        const message = {
            chatId,
            ownerId: userId,
            body,
            isForwarded,
            forwardedFromUser: isForwarded ? forwardedFromUser : null,
            dateCreated: Date.now(),
        };
        try {
            await MessageService.#QUERYBUILDER.create({
                table_name: MessageService.#TABLE_NAME,
                columns: Object.keys(message),
                values: Object.values(message),
            });
            return {
                message: 'Created successfully!',
            };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async updateMessage({ message }) {
        const { messageId, ...newMessage } = message;
        try {
            await MessageService.#QUERYBUILDER.update({
                table_name: MessageService.#TABLE_NAME,
                columns: Object.keys(newMessage),
                values: Object.values(newMessage),
                where: [{ column: 'messageId', value: messageId }],
            });
            return { message: 'Updated successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async deleteMessagesForBoth({ messageIds, query }) {
        const ids = messageIds || JSON.parse(query.message_ids || '[]');
        if (ids.length == 0) return { message: 'No messages!' };
        const request = `DELETE FROM ${
            MessageService.#TABLE_NAME
        } WHERE "messageId" = ANY(Array [${ids}])`;
        try {
            await MessageService.#QUERYBUILDER.useQuery(request, []);
            return { message: 'Deleted successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async getLastMessageByChat({ chatId }) {
        try {
            const messages = await MessageService.#QUERYBUILDER.findOne({
                table_name: MessageService.#TABLE_NAME,
                where: [{ column: 'chatId', value: chatId }],
            });
            return { messages };
        } catch (err) {
            throw new Error(err);
        }
    }

    static async deleteMessagesByChatId({ chatId }) {
        try {
            await MessageService.#QUERYBUILDER.delete({
                table_name: MessageService.#TABLE_NAME,
                where: [{ column: 'chatId', value: chatId }],
            });
            return { message: 'Deleted successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = MessageService;
