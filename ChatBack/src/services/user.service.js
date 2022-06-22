const QueryBuilder = require('../db/querybuilder');
const { U_NF } = require('../errors/error.list');

class UserService {
    static #TABLE_NAME = 'users';
    static #QUERYBUILDER = new QueryBuilder();
    static async createUser(user) {
        try {
            await UserService.#QUERYBUILDER.create({
                table_name: UserService.#TABLE_NAME,
                columns: Object.keys(user),
                values: Object.values(user),
            });
        } catch (err) {
            throw new Error(err);
        }
    }
    static async updateProfile({ user, userId }) {
        try {
            await UserService.#QUERYBUILDER.update({
                table_name: UserService.#TABLE_NAME,
                columns: Object.keys(user),
                values: Object.values(user),
                where: [{ column: 'userId', value: userId }],
            });
            return { message: 'Updated successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async getUser({ userId }) {
        try {
            // eslint-disable-next-line no-unused-vars
            const { password, ...user } =
                await UserService.#QUERYBUILDER.findOne({
                    table_name: UserService.#TABLE_NAME,
                    where: [{ column: 'userId', value: userId }],
                });
            if (!user || user == {}) throw U_NF;
            return user;
        } catch (err) {
            throw new Error(err);
        }
    }
    static async blockUser({ userId, blockedUserId }) {
        if (!blockedUserId || blockedUserId == '') return;
        try {
            await UserService.#QUERYBUILDER.create({
                table_name: 'blockedusers',
                columns: ['ownerUserId', 'blockedUserId'],
                values: [userId, blockedUserId],
            });
            return { message: 'User blocked successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async unblockUser({ userId, query }) {
        if (!query.blocked_user_id || query.blocked_user_id == '') return;
        try {
            await UserService.#QUERYBUILDER.delete({
                table_name: 'blockedusers',
                where: [
                    { column: 'ownerUserId', value: userId },
                    { column: 'blockedUserId', value: query.blocked_user_id },
                ],
            });
            return { message: 'User unblocked successfully!' };
        } catch (err) {
            throw new Error(err);
        }
    }
    static async getUserByEmail(email) {
        try {
            const user = await UserService.#QUERYBUILDER.findOne({
                table_name: UserService.#TABLE_NAME,
                where: [{ column: 'email', value: email }],
            });
            if (user) return user;
            return false;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    static async isUserNameExist(userName) {
        try {
            const user = await UserService.#QUERYBUILDER.findOne({
                table_name: UserService.#TABLE_NAME,
                where: [{ column: 'userName', value: userName }],
            });
            if (user) return true;
            return false;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = UserService;
