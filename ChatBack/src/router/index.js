const { AuthController, ChatController } = require('../controllers');

class Router {
    static routes = {
        // '/': (res) => {
        //     console.log('home');
        //     res.end('home');
        // },
        '/chats': ChatController,
        '/auth': AuthController,
    };

    static async route(req, res) {
        const handler = this.routes[`/${req.url.slice(1).split('/', 1)[0]}`];
        if (!handler) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not found 404!' }));
            return;
        }
        await handler.use(req, res);
    }
}

module.exports = Router;
