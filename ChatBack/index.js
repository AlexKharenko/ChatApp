const http = require('http');
require('dotenv').config();

const server = http.createServer(async (req, res) => {
    console.log(req, res);
    res.end('Hello world!');
});

server.listen(process.env.PORT, process.env?.HOSTNAME, () => {
    console.log(
        `Server is listening on ${process.env?.HOSTNAME || 'localhost'}:${
            process.env.PORT
        }`
    );
});
