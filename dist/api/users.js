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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
const { getAllUsers, getUserById, getUserByUsername, createUser, updateUser, deleteUser, activateUser, } = require('../db/models/users');
const { getJobByUserID } = require('../db/models/jobs');
// GET api/users/
usersRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getAllUsers();
    res.send(users);
}));
// GET api/users/jobs/:user_id
usersRouter.get('/jobs/:user_id/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(req.params.user_id); // Parse user_id to integer
        const trackedJobs = yield getJobByUserID(user_id);
        if (trackedJobs.length === 0)
            return res.json(`No jobs found from user: ${user_id}`);
        res.json(trackedJobs);
    }
    catch (error) {
        console.error('Error retrieving jobs for user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// GET api/users/id/:user_id
usersRouter.get('/id/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(req.params.user_id);
        const user = yield getUserById(user_id);
        if (!user)
            return res.json(`No user id: ${user_id} found`);
        const trackedJobs = yield getJobByUserID(user_id);
        user.jobs = trackedJobs;
        res.json(user);
    }
    catch (error) {
        console.error('Error retrieving user by id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// GET api/users/username
usersRouter.get('/username/:username', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        const user = yield getUserByUsername(username);
        if (!user)
            return res.json(`No user named: [${username}] found.`);
        const trackedJobs = yield getJobByUserID(user.id);
        user.jobs = trackedJobs;
        res.json(user);
    }
    catch (error) {
        console.error('Error retreiving user by username', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// POST api/users/register
usersRouter.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, avatar } = req.body;
    const user = yield createUser({
        username,
        password,
        email,
        avatar,
    });
    res.send({
        message: 'Thank you for signing up! 😎',
        user,
    });
}));
// PATCH api/users/edit/:user_id
usersRouter.patch('/edit/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, avatar } = req.body;
        const userID = parseInt(req.params.user_id);
        const user = yield getUserById(userID);
        if (!user)
            return res.send(`Forbidden Access`);
        const fields = {
            username: username,
            password: password,
            email: email,
            avatar: avatar,
        };
        const userUpdate = yield updateUser(user.id, fields);
        res.send({
            message: `Profile updated successfully! ✌️`,
            userUpdate,
        });
    }
    catch (error) { }
}));
// DELETE api/users/deactivate/:user_id
usersRouter.delete('/deactivate/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const checkUser = yield getUserById(userID);
        if (!checkUser) {
            next({
                name: `UserNotFoundError`,
                message: `User does not exist with id: ${userID} 🤔`,
            });
        }
        const deletedUser = yield deleteUser(userID);
        res.send({
            message: 'User Deactivated',
            deletedUser,
        });
    }
    catch (error) {
        console.error(`error deleting user endpoint`, error);
        next(error);
    }
}));
// PATCH api/users/activate/:user_id
usersRouter.patch('/activate/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const checkUser = yield getUserById(userID);
        if (!checkUser) {
            next({
                name: `UserNotFoundError`,
                message: `User does not exist with id: ${userID} 🤔`,
            });
        }
        const activate = yield activateUser(userID);
        res.send({
            message: 'User Activated',
            activate,
        });
    }
    catch (error) { }
}));
module.exports = usersRouter;
