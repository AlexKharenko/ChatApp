const Database = require('../config/db.config');
// const { Error500 } = require('../errors/index');

class QueryBuilder {
    constructor() {
        this.DB = Database.getInstance();
    }

    async create({ table_name, columns, values, returning }) {
        const request = `INSERT INTO ${table_name}`;
        const valuesPart = `(${columns
            .map((key) => `"${key}"`)
            .join(', ')}) VALUES(${values
            .map((key) => {
                if (typeof key === 'number') {
                    return key;
                }
                if (key === null) {
                    return 'NULL';
                }
                return `'${key}'`;
            })
            .join(', ')})`;
        const returningPart = `${
            returning ? ` RETURNING "${returning}"` : ''
        };`;
        try {
            const res = await this.DB.pool.query(
                request + valuesPart + returningPart
            );
            return res.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update({ table_name, columns, values, where }) {
        let counter = 1;
        const sets = columns
            .map((key) => `"${key}"=($${counter++})`)
            .join(', ');
        const val = values.map((key) => key);
        const whereStatements = `${where
            .map(
                ({ column, comparator }) =>
                    `"${column}" ${comparator || '='} ($${counter++})`
            )
            .join(' AND ')} `;
        const request = `UPDATE ${table_name} SET ${sets} WHERE (${whereStatements})`;
        try {
            return await this.DB.pool.query(request, [
                ...val,
                ...where.map((obj) => obj.value),
            ]);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async delete({ table_name, where, returning, def_ret = true }) {
        let counter = 1;
        if (where.length === 0) return [];
        const whereStatements = `${where
            .map(
                ({ column, comparator }) =>
                    `"${column}" ${comparator || '='} $${counter++}`
            )
            .join(' AND ')} `;

        const returningPart = `${returning ? `RETURNING *` : ''};`;
        const request = `DELETE FROM ${table_name} WHERE ${whereStatements} ${returningPart}`;
        try {
            const res = await this.DB.pool.query(
                request,
                where.map((obj) => obj.value)
            );
            if (!def_ret) return res.rows;
            return res.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async find(
        {
            table_name,
            query,
            where = [],
            join,
            join_type = 'LEFT OUTER JOIN',
            distinct = false,
            order_by,
            offset,
        },
        limit
    ) {
        let counter = 1;
        let where_or = false;
        const whereStatements = `${
            where.length > 0
                ? `WHERE ${where
                      .map(({ column, comparator, or }) => {
                          where_or = or || false;
                          return `${join ? `${table_name}.` : ''}"${column}" ${
                              comparator || '='
                          } $${counter++}`;
                      })
                      .join(where_or ? ' OR ' : ' AND ')}`
                : ''
        }`;
        const joinStatements = join
            ? `${join_type} ${join.compare_table} ON ${table_name}.${join.column} = ${join.compare_table}.${join.compare_column}`
            : '';
        const orderByStatement =
            order_by !== {} && order_by !== undefined && order_by.desc
                ? `ORDER BY ${order_by.column} ${order_by.desc}`
                : '';

        const offsetStatement = offset ? `OFFSET ${offset} ROWS` : ' ';
        const limitStatement = limit ? `LIMIT ${limit} ` : ' ';
        const request = `SELECT ${distinct ? 'DISTINCT' : ''} ${
            query ? query.map((column) => `"${column}"`).join(',') : '*'
        } FROM "${table_name}" ${joinStatements} ${whereStatements} ${orderByStatement} ${offsetStatement} ${limitStatement}`;
        try {
            const res = await this.DB.pool.query(
                request,
                where.map((obj) => obj.value)
            );
            return res.rows;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findOne(params) {
        const res = await this.find(params, 1);
        return res[0];
    }

    async useQuery(request, values = []) {
        const res = await this.DB.pool.query(request, values);
        return res;
    }
}

module.exports = QueryBuilder;
