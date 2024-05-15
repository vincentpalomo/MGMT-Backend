"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const DB_URL = process.env.DATABASE_URL;
try {
    exports.client = new pg_1.Client({
        connectionString: DB_URL
    });
}
catch (error) {
    console.error('Error creating PostgreSQL client:', error);
    process.exit(1);
}
module.exports = { client: exports.client };
