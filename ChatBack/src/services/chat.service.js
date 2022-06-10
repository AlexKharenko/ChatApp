const QueryBuilder = require('../db/querybuilder');
const { C_NF } = require('../errors/error.list');
const UserService = require('./user.service');
const MessageService = require('./message.service');

class ChatService {
    static #TABLE_NAME = 'chats';
    static #QUERYBUILDER = new QueryBuilder();
    static async #getChatByIds({ userId, secondUserId }) {
        try {
            const chat = await ChatService.#QUERYBUILDER.findOne({
                table_name: ChatService.#TABLE_NAME,
                where: [
                    { column: 'firstUserId', value: userId },
                    { column: 'secondUserId', value: secondUserId, or: true },
                    { column: 'firstUserId', value: secondUserId },
                    { column: 'secondUserId', value: userId },
                ],
            });
            if (chat || chat != {}) return chat;
            return false;
        } catch (err) {
            throw new Error(err);
        }
    }
    static async getChat({ userId, chatId }) {
        try {
            const chat = await ChatService.#QUERYBUILDER.findOne({
                table_name: ChatService.#TABLE_NAME,
                where: [{ column: 'chatId', value: chatId }],
            });
            if (!chat || chat == {}) throw C_NF;
            return {
                chat,
                toUser: await UserService.getUser({
                    userId:
                        chat.firstUserId == userId ? userId : chat.secondUserId,
                }),
            };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async getChats({ userId }) {
        try {
            const chats = await ChatService.#QUERYBUILDER.find({
                table_name: ChatService.#TABLE_NAME,
                where: [
                    { column: 'firstUserId', value: userId, or: true },
                    { column: 'secondUserId', value: userId },
                ],
            });
            if (!chats || chats.length == 0) throw C_NF;
            for (let chat of chats) {
                chat.toUser = await UserService.getUser({
                    userId:
                        chat.firstUserId == userId ? userId : chat.secondUserId,
                });
                chat.lastMessage = await MessageService.getLastMessageByChat({
                    chatId: chat.chatId,
                });
            }
            return { chats };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async createChat({ userId, secondUserId }) {
        try {
            const chat = await ChatService.#getChatByIds({
                userId,
                secondUserId,
            });
            if (chat)
                return {
                    chatId: chat.chatId,
                    message: 'Already exist!',
                    redirect: 'chat',
                };
            const { chatId } = await ChatService.#QUERYBUILDER.create({
                table_name: ChatService.#TABLE_NAME,
                columns: ['firstUserId', 'secondUserId'],
                values: [userId, secondUserId],
                returning: 'chatId',
            });
            return {
                chatId,
                message: 'Created successfully!',
                redirect: 'chat',
            };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async deleteChat({ chatId }) {
        try {
            await ChatService.#QUERYBUILDER.delete({
                table_name: ChatService.#TABLE_NAME,
                where: [{ column: 'chatId', value: chatId }],
            });
            await MessageService.deleteMessagesByChatId({ chatId });
            return { message: 'Deleted successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = ChatService;
