"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
// const client = require('./client')
const { createUser } = require('./models/users');
// drop all tables before seeding
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Dropping all tables...💀`);
            yield client_1.client.query(`
    DROP TABLE IF EXISTS comments
    DROP TABLE IF EXISTS tags
    DROP TABLE IF EXISTS jobs
    DROP TABLE IF EXISTS users
    `);
            console.log(`Finished dropping tables... 🙂`);
        }
        catch (error) {
            console.error(`Error dropping tables... 😒`);
        }
    });
}
// create tables
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting to build tables... 💫');
            yield client_1.client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(225) UNIQUE NOT NULL,
        password VARCHAR(225) NOT NULL,
        avatar TEXT,
        isActive BOOLEAN DEFAULT true
      );
    `);
            console.log('Finished creating tables... ✅');
        }
        catch (error) {
            console.error('Error creating tables... 💢');
        }
    });
}
// create initial test users
const createInitialUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating users... 💫');
        const initialUsers = [
            {
                username: 'test',
                password: '1234',
                avatar: 'no image',
            },
            {
                username: 'jinx',
                password: 'bestbb',
                avatar: 'no image',
            },
        ];
        const createNewUser = yield Promise.all(initialUsers.map(createUser));
        console.log(createNewUser);
        console.log('Finished creating users... ✅');
    }
    catch (error) {
        console.error('Error creating users... 💢');
    }
});
// function to rebuildDB
function rebuildDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('initializing client 👀');
            client_1.client.connect();
            console.log('client initialized 🚀');
            yield dropTables();
            yield createTables();
            yield createInitialUsers();
            client_1.client.end();
        }
        catch (error) {
            console.error('Error rebuilding DB', error);
        }
    });
}
rebuildDB();
module.exports = {
    rebuildDB,
    dropTables,
};
