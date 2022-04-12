// const { MessageController, AuthController } = require('../controllers');

class Router {
    static routes = {
        '/': (res) => {
            console.log('home');
            res.end('home');
        },
        '/message': (res) => {
            console.log('message');
            res.end('message');
        },
        '/auth': (res) => {
            console.log('auth');
            res.end('auth');
        },
    };

    static route(req, res) {
        const handler = this.routes[`/${req.url.slice(1).split('/', 1)[0]}`];
        if (!handler) {
            console.log('Not found');
            res.end('Not found!');
            return; 
        }
        handler(res);
    }
}

module.exports = Router;
