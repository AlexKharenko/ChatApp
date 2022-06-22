require('dotenv').config();
const { WebSocketServer } = require('ws');
const { wsVerifyAuth } = require('./src/services/auth.service');
const { sendForClient } = require('./ws/helpers/send.methods');
const onConnectionEvent = require('./ws/utilities/onenter');
const onLeaveEvent = require('./ws/utilities/onleave');
const use = require('./ws/events/message.events');

class WSServer {
    constructor() {
        this.SERVER = new WebSocketServer({
            port: process.env.WS_PORT,
            verifyClient: this.#checkClient,
        });
        this.SERVER.on('connection', this.#onConnection);
    }

    async #checkClient({ req }, cb) {
        const { headers } = req;
        if (headers['sec-websocket-protocol']) {
            const authToken = req.headers['sec-websocket-protocol'];
            const verifyResult = wsVerifyAuth(req, authToken);
            if (!verifyResult) cb(false, 401, 'Unauthorized');
            cb(true);
        } else {
            cb(false, 401, 'Unauthorized');
        }
    }

    async #onConnection(wsClient, req) {
        const userId = req?.user?.userId;
        if (userId == null || userId == undefined) wsClient.close();
        wsClient.userId = userId;
        await onConnectionEvent(this, wsClient, wsClient.userId).catch(() => {
            const message = {
                event: 'serverError',
                message: 'Something happened!',
            };
            sendForClient(wsClient, message);
        });

        wsClient.on('message', async (message) => {
            const data = JSON.parse(message);
            await use(this, wsClient, data);
        });

        wsClient.on('close', async () => {
            await onLeaveEvent(this, wsClient.userId);
        });
    }
}

new WSServer();
