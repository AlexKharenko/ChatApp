const url = require('url');

class urlParser {
    static parseUrl(req) {
        const parsedUrl = url.parse(req.url);
        const rawQuery = parsedUrl.split('&');
        const parsedQuery = [];
        for (const query in rawQuery) {
            const splitedQuery = query.split('=');
            parsedQuery.push({ [splitedQuery[0]]: splitedQuery[1] });
        }
        req.query = parsedQuery;
    }
}

module.exports = urlParser;
