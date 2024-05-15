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
// const { createUser } = require('./models/users')
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Dropping all tables...💀`);
            yield client_1.client.query(`
    DROP TABLE IF EXISTS comments
    DROP TABLE IF EXISTS tags
    DROP TABLE IF EXISTS goals
    DROP TABLE IF EXISTS users
    `);
            console.log(`Finished dropping tables... 🙂`);
        }
        catch (error) {
            console.error(`Error dropping tables... 😒`);
        }
    });
}
module.exports = {
    dropTables,
};
