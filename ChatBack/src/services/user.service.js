const users = [];

class UserService {
    static async getUser({ userId }) {

        return users[userId];
    }
}

module.exports = UserService;
