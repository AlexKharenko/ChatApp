const {
    AuthController,
    ChatController,
    UserController,
    MessageController,
    SearchController,
} = require('../controllers');

class Router {
    static routes = {
        '/search': SearchController,
        '/message': MessageController,
        '/messages': MessageController,
        '/users': UserController,
        '/chats': ChatController,
        '/auth': AuthController,
    };

    static async route(req, res) {
        const handler =
            this.routes[`/${req.parsedUrl.slice(1).split('/', 1)[0]}`];
        if (!handler) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not found 404!' }));
            return;
        }
        await handler.use(req, res);
    }
}

module.exports = Router;
