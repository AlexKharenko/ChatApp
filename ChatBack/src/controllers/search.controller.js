const AuthService = require('../services/auth.service');
const SearchService = require('../services/search.service');

class UserController {
    static methods = {
        '/search': {
            GET: {
                func: SearchService.searchUserByUserName,
                response: (data, req, res) => {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                },
                verify: true,
            },
        },
    };

    static async use(req, res) {
        const route = this.methods[req.parsedUrl]
            ? this.methods[req.parsedUrl][req.method]
            : undefined;
        if (!route) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not found 404!' }));
            return;
        }

        try {
            if (route.verify) {
                AuthService.verifyAuth(req);
            }
            const data = req?.body?.data || {};
            const result = await route.func({
                ...data,
                userId: req?.user?.userId,
                query: req.query,
            });
            route.response(result, req, res);
        } catch (err) {
            res.statusCode = err.statusCode || 500;
            res.end(JSON.stringify({ message: err.message }));
        }
    }
}

module.exports = UserController;
