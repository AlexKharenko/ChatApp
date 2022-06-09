const { AuthService } = require('../services');

class AuthController {
    static methods = {
        '/auth/signup': {
            POST: {
                func: AuthService.signUp,
                response: (data, req, res) => {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                },
            },
        },
        '/auth/signin': {
            POST: {
                func: AuthService.signIn,
                response: ({ authToken, ...data }, req, res) => {
                    res.statusCode = 200;
                    req.client.setCookie('authToken', authToken, true);
                    req.client.sendCookie();
                    res.end(JSON.stringify(data));
                },
            },
        },
        '/auth/logout': {
            POST: {
                func: async () => {
                    return { message: 'You are succesfully logged out' };
                },
                response: (data, req, res) => {
                    res.statusCode = 200;
                    req.client.deleteCookie('authToken');
                    req.client.sendCookie();
                    res.end(JSON.stringify(data));
                },
            },
        },
    };

    static async use(req, res) {
        const route = this.methods[req.url][req.method];
        if (!route) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not found 404!' }));
            return;
        }
        try {
            const data = req?.body?.data || {};
            const result = await route.func({ ...data });
            route.response(result, req, res);
        } catch (err) {
            res.statusCode = err.statusCode || 500;
            res.end(JSON.stringify({ message: err.message }));
        }
    }
}

module.exports = AuthController;
