const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = (host) => {
    if (!host) return 'no-host-name-in-http-headers';
    const portOffset = host.indexOf(':');
    if (portOffset > -1) host = host.substr(0, portOffset);
    return host;
};

class Client {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.host = parseHost(req.headers.host);
        this.cookie = {};
        this.preparedCookie = [];
        this.parseCookie();
    }

    static async getInstance(req, res) {
        return new Client(req, res);
    }

    parseCookie() {
        const { req } = this;
        const { cookie } = req.headers;
        if (!cookie) return;
        const items = cookie.split(';');
        for (const item of items) {
            const parts = item.split('=');
            const key = parts[0].trim();
            const val = parts[1] || '';
            this.cookie[key] = val.trim();
        }
    }

    setCookie(name, val, httpOnly = false) {
        const { host } = this;
        const maxAge = `Max-Age=${process.env.COOKIE_EXPIRE}`;
        let cookie = `${name}=${val}; ${maxAge}; Path=/; Domain=${host}`;
        if (httpOnly) cookie += '; HttpOnly';
        this.preparedCookie.push(cookie);
    }

    deleteCookie(name) {
        this.preparedCookie.push(name + COOKIE_DELETE + this.host);
    }

    sendCookie() {
        const { res, preparedCookie } = this;
        if (preparedCookie.length && !res.headersSent) {
            res.setHeader('Set-Cookie', preparedCookie);
        }
    }
}

module.exports = Client;
