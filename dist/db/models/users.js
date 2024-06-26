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
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, password, email, avatar }) {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
        const { rows: user } = yield client_1.client.query(`
    INSERT INTO users(username, password, email, avatar)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, avatar
    `, [username, hashedPassword, email, avatar]);
        return user;
    }
    catch (error) {
        console.error('error creating user DB', error);
    }
});
// get user by username
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user], } = yield client_1.client.query(`
    SELECT id, username, password, email, avatar FROM users
    WHERE username = $1
    `, [username]);
        return user;
    }
    catch (error) {
        console.error('Error retrieving user from DB', error);
    }
});
// get single user *authentication
const getUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ username, password }) {
    try {
        const user = yield getUserByUsername(username);
        const hashedPassword = user.password;
        const isValid = yield bcrypt.compare(password, hashedPassword);
        if (isValid) {
            delete user.password;
            return user;
        }
        else {
            throw new Error('Invalid username or password');
        }
    }
    catch (error) {
        console.error('Error retrieving single user from DB', error);
    }
});
// get user by id
const getUserById = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user], } = yield client_1.client.query(`
    SELECT id, username, email, avatar FROM users
    WHERE id = $1    
    `, [userID]);
        return user;
    }
    catch (error) {
        console.error('Error retrieving User by ID from DB', error);
    }
});
// get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: users } = yield client_1.client.query(`
    SELECT id, username, avatar, email, is_active FROM users
    `);
        return users;
    }
    catch (error) {
        console.error('Error retreiving all users from DB', error);
    }
});
// edit user
const updateUser = (userID, fields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SALT_COUNT = 10;
        const password = fields.password;
        const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
        fields.password = hashedPassword;
        const setString = Object.keys(fields)
            .map((key, index) => `"${key}"=$${index + 1}`)
            .join(', ');
        const { rows: [user], } = yield client_1.client.query(`
    UPDATE users
    SET ${setString}
    WHERE id = ${userID}
    RETURNING *
    `, Object.values(fields));
        delete user.password;
        return user;
    }
    catch (error) {
        console.error('Error updating user in DB', error);
    }
});
// delete user
const deleteUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: user } = yield client_1.client.query(`
    UPDATE users
    SET "is_active" = false
    WHERE id = $1
    RETURNING username
    `, [userID]);
        return user;
    }
    catch (error) {
        console.error('Error setting user inactive from DB', error);
    }
});
// activate user
const activateUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: user } = yield client_1.client.query(`
  UPDATE users
  SET "is_active" = true
  WHERE id = $1
  RETURNING username
  `, [userID]);
    return user;
});
module.exports = {
    createUser,
    getUserByUsername,
    getUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    activateUser,
};
