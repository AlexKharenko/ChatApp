const sendForClientWithId = (server, clientId, message) => {
    for (let client of server.clients) {
        if (client.userId == clientId) {
            client.send(JSON.stringify(message));
        }
    }
};

const sendForClient = (client, message) => {
    client.send(JSON.stringify(message));
};

module.exports = { sendForClientWithId, sendForClient };
