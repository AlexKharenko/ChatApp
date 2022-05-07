class bodyParse {
    static async parseBody(req) {
        try {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }

            const data = Buffer.concat(buffers).toString();
            const parsedData = JSON.parse(data || '{}');
            return parsedData;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = bodyParse;
