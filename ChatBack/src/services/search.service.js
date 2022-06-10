const QueryBuilder = require('../db/querybuilder');

class SearchService {
    static #TABLE_NAME = 'users';
    static #QUERYBUILDER = new QueryBuilder();

    static async searchUserByUserName({ query }) {
        if (!query.username) return [];
        const request = `SELECT "userId", "firstName", "lastName", "userName", "email" FROM ${
            SearchService.#TABLE_NAME
        } WHERE "userName" ILIKE '%${query.username}%'`;
        try {
            const { rows: users } = await SearchService.#QUERYBUILDER.useQuery(
                request,
                []
            );
            return users;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = SearchService;
