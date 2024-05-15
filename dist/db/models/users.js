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
// const { client } = require('../client')
const client_1 = require("../client");
const bcrypt = require('bcrypt');
// create users
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, password, avatar }) {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
        const { rows: user } = yield client_1.client.query(`
    INSERT INTO users(username, password, avatar)
    VALUES ($1, $2, $3)
    RETURNING id, username, avatar
    `, [username, hashedPassword, avatar]);
        return user;
    }
    catch (error) {
        console.error('error creating user DB', error);
    }
});
module.exports = {
    createUser,
};
