const { AuthService } = require('../services');

class AuthController {
    static methods = {
        POST: {
            '/auth/signup': {
                func: AuthService.signUp,
                response: (data, req, res) => {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                },
            },
            '/auth/signin': {
                func: AuthService.signIn,
                response: ({ token, ...data }, req, res) => {
                    res.statusCode = 200;
                    req.client.setCookie('authToken', token, true);
                    req.client.sendCookie();
                    res.end(JSON.stringify(data));
                },
            },
            '/auth/logout': {
                func: () => {
                    return { message: 'You are succesfully logged out' };
                },
                response: ({ data }, req, res) => {
                    res.statusCode = 200;
                    req.client.deleteCookie('authToken');
                    req.client.sendCookie();
                    res.end(JSON.stringify(data));
                },
            },
        },
    };

    static async use(req, res) {
        const route = this.methods[req.method][req.url];
        if (!route) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not found 404!' }));
            return;
        }
        try {
            const data = JSON.parse(req?.body?.data || '{}');
            const result = await route.func({ ...data });
            route.response(result, req, res);
        } catch (err) {
            res.statusCode = err.statusCode || 500;
            res.end(JSON.stringify({ message: err.message }));
        }
    }
}

module.exports = AuthController;
