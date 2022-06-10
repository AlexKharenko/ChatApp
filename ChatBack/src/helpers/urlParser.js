const url = require('url');

class urlParser {
    static parseUrl(req) {
        const parsedUrl = url.parse(req.url);
        const rawQuery = parsedUrl.query ? parsedUrl.query.split('&') : [];
        const parsedQuery = {};
        for (const query of rawQuery) {
            const splitedQuery = query.split('=');
            parsedQuery[[splitedQuery[0]]] = splitedQuery[1];
        }
        req.query = parsedQuery;
        req.parsedUrl = parsedUrl.pathname;
    }
}

module.exports = urlParser;
