'use strict';

const http = require('http');
const bodyParser = require('./src/helpers/bodyParser');
const urlParser = require('./src/helpers/urlParser');
const Client = require('./src/helpers/client');
require('dotenv').config();

const Router = require('./src/router');

const server = http.createServer(async (req, res) => {
    req.body = await bodyParser.parseBody(req);
    urlParser.parseUrl(req);

    const client = await Client.getInstance(req, res);
    client.parseCookie();
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
