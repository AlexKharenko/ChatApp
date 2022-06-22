const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserService = require('./user.service');
const {
    U_E,
    E_E,
    E_OR_P_NC,
    T_R,
    I_T,
    F_S_NE,
} = require('../errors/error.list');

class AuthService {
    static #SALT = 10;

    static #checkSighUpFields(user) {
        const keys = ['userName', 'email', 'firstName', 'lastName', 'password'];
        for (let key of keys) {
            if (!user[key] || user[key] == '') {
                throw F_S_NE;
            }
        }
    }

    static async #isPasswordCorrect(hashedPassword, password) {
        if (await bcrypt.compare(password, hashedPassword)) {
            return true;
        }
        return false;
    }

    static async signUp(user) {
        AuthService.#checkSighUpFields(user);
        if (await UserService.isUserNameExist(user.userName)) {
            throw U_E;
        }
        if (await UserService.getUserByEmail(user.email)) {
            throw E_E;
        }
        const hashedPassword = await bcrypt.hash(
            user.password,
            AuthService.#SALT
        );
        const newUser = {
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: hashedPassword,
        };
        await UserService.createUser(newUser);
        return { message: 'Created successfully' };
    }

    static async signIn({ email, password }) {
        const user = await UserService.getUserByEmail(email);
        if (!user) throw E_OR_P_NC;
        const correct = await AuthService.#isPasswordCorrect(
            user.password,
            password
        );
        if (!correct) throw E_OR_P_NC;
        const authToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET
        );
        return { message: 'Signed In successfully', authToken };
    }

    static verifyAuth(req) {
        const { authToken } = req.client.cookie;
        if (!authToken) {
            throw T_R;
        }
        try {
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            throw I_T;
        }
    }

    static wsVerifyAuth(req, token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = AuthService;
