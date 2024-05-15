"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiRouter = express_1.default.Router();
// server health
apiRouter.get('/', (req, res, next) => {
    res.send({
        message: 'Server is online 🟢',
    });
});
// routers
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);
const jobsRouter = require('./jobs');
apiRouter.use('/jobs', jobsRouter);
module.exports = apiRouter;
