const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { L_E, L_OR_P_NC, T_R, I_T } = require('../errors/error.list');

const users = [
    {
        userId: 1,
        login: 'alex',
        password: 'user1234',
    },
];

class AuthService {
    static #SALT = 10;

    static #DoesLoginExist(login) {
        for (const user of users) {
            if (user.login === login) {
                return true;
            }
        }
        return false;
    }

    static async #isPasswordCorrect(hashedPassword, password) {
        if (await bcrypt.compare(password, hashedPassword)) {
            return true;
        }
        return false;
    }

    static async signUp({ login, password }) {
        if (!login || !password) throw L_OR_P_NC;
        if (AuthService.#DoesLoginExist(login)) {
            throw L_E;
        }

        let maxId = 0;
        for (const user of users) {
            maxId = maxId > user.userId ? maxId : user.userId;
        }
        const hashedPassword = await bcrypt.hash(password, AuthService.#SALT);
        const newUser = {
            userId: maxId + 1,
            login,
            password: hashedPassword,
        };
        users.push(newUser);
        console.log('signUp');
        console.dir(users);
        return { message: 'Created successfully' };
    }

    static async signIn({ login, password }) {
        const user = users.filter((item) => (item.login = login))[0];
        if (!user) throw L_OR_P_NC;
        const correct = AuthService.#isPasswordCorrect(user.password, password);
        if (!correct) throw L_OR_P_NC;
        const authToken = jwt.sign(
            { userId: user.userId, username: user.login },
            process.env.JWT_SECRET,
            { algorithm: 'RS256', expiresIn: '24h' },
        );
        console.log('signIn');
        return { message: 'Signed In successfully', authToken };
    }

    static verifyAuth({ authToken }) {
        if (!authToken) {
            throw T_R;
        }
        try {
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            return { verified: true, user: decoded };
        } catch (err) {
            throw I_T;
        }
    }
}

module.exports = AuthService;
