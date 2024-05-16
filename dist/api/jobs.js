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
const jobsRouter = express_1.default.Router();
const { createJob, getAllJobs, getJobByUserID } = require('../db/models/jobs');
const { getUserById } = require('../db/models/users');
// GET api/jobs/
jobsRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield getAllJobs();
    res.send(jobs);
}));
// GET api/jobs/user/:user_id
jobsRouter.get('/user/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const user = yield getUserById(userID);
        if (!user)
            return res.send(`User: ${userID} does not exist 😥`);
        const trackedJobs = yield getJobByUserID(userID);
        user.jobs = trackedJobs;
        if (user.jobs.length === 0)
            return res.send(`No current jobs with this user 😥`);
        res.send(user);
    }
    catch (error) { }
}));
// POST api/jobs/create/:user_id
jobsRouter.post('/create/:user_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, } = req.body;
        const job = yield createJob({
            title,
            company_name,
            jobURL,
            location,
            date_applied,
            application_status,
            interview_date,
            interview_type,
            salary,
            follow_up,
            notes,
            user_id,
            is_active,
        });
        res.send({
            message: 'Job application added! 😊',
            job,
        });
    }
    catch (error) {
        console.error('Error creating job', error);
    }
}));
module.exports = jobsRouter;
