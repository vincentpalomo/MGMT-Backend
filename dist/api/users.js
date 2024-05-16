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
const { getAllUsers, getUserById, getUserByUsername } = require('../db/models/users');
const { getJobByUserID } = require('../db/models/jobs');
// GET api/users/
usersRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getAllUsers();
    res.send(users);
}));
// GET api/users/user_id/jobs
usersRouter.get('/:user_id/jobs', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = parseInt(req.params.user_id); // Parse user_id to integer
        const trackedJobs = yield getJobByUserID(user_id);
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
        const trackedJobs = yield getJobByUserID(user.id);
        user.jobs = trackedJobs;
        res.json(user);
    }
    catch (error) {
        console.error('Error retreiving user by username', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
module.exports = usersRouter;
