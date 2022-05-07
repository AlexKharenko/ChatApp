'use strict';

const http = require('http');
const Client = require('./src/helpers/client');
require('dotenv').config();

const Router = require('./src/router');

const server = http.createServer(async (req, res) => {
    // console.log(req, res);
    const client = Client.getInstance(req, res);
    await client.parseCookie();
    req.client = client;
    await Router.route(req, res);
});

server.listen(process.env.PORT, process.env?.HOSTNAME, () => {
    console.log(
        `Server is listening on http://${
            process.env?.HOSTNAME || 'localhost'
        }:${process.env.PORT}`
    );
});
