const { AuthService, ChatService } = require('../services');

class ChatController {
    static methods = {
        GET: {
            '/chats/': {
                func: ChatService.getAll,
                response: (data, req, res) => {
                    res.statusCode = 200;
                    res.end(JSON.stringify(data));
                },
                verify: true,
            },
            // '/chats/:id': {
            //     func: ChatService.getById,
            //     response: (data, req, res) => {
            //         res.statusCode = 200;
            //         res.end(JSON.stringify(data));
            //     },
            //     verify: true,
            // },
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
            if (route.verify) {
                AuthService.verifyAuth(req);
            }
            const data = req?.body?.data || {};
            const result = await route.func({ ...data });
            route.response(result, req, res);
        } catch (err) {
            res.statusCode = err.statusCode || 500;
            res.end(JSON.stringify({ message: err.message }));
        }
    }
}

module.exports = ChatController;
