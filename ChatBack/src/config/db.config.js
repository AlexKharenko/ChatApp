const { Pool } = require('pg');

const { DB_HOST, DB_NAME, DB_USER, DB_PORT, DB_PASSWORD } = process.env;

const localPoolConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
};

const poolConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
      }
    : localPoolConfig;

const pool = new Pool(poolConfig);

class Database {
    constructor() {
        this.pool = pool;
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database;
