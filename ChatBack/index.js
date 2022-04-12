const http = require('http');
require('dotenv').config();

const Router = require('./src/router');

const server = http.createServer(async (req, res) => {
    // console.log(req, res);
    Router.route(req, res);
});

server.listen(process.env.PORT, process.env?.HOSTNAME, () => {
    console.log(
        `Server is listening on http://${
            process.env?.HOSTNAME || 'localhost'
        }:${process.env.PORT}`
    );
});
