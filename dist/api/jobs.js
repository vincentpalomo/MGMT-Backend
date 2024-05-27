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
const { createJob, updateJob, deleteJob, getAllJobs, getJobByUserID, getJobByPostID } = require('../db/models/jobs');
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
    catch (error) {
        console.error('Error getting user by id', error);
        next(error);
    }
}));
// GET api/jobs/user/:user_id/post/:post_id
jobsRouter.get('/user/:user_id/post/:post_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const postID = parseInt(req.params.post_id);
        const user = yield getJobByUserID(userID);
        const post = yield getJobByPostID(userID, postID);
        if (!user)
            return res.send(`User: ${userID} does not exist 😢`);
        if (!post)
            return res.send(`Post: ${postID} does not exist 😢`);
        res.send(post);
    }
    catch (error) {
        console.error('Error getting user job by id', error);
        next(error);
    }
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
        next(error);
    }
}));
// PUT api/jobs/update/:job_id *admin
jobsRouter.patch('/update/:job_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.job_id);
        const { title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, } = req.body;
        // Call the updateJob function to update the job in the database
        const job = yield updateJob({
            id: jobId,
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
            message: 'Job updated successfully 😊',
            job,
        });
    }
    catch (error) {
        console.error('Error updating job', error);
        next(error);
    }
}));
// PUT api/jobs/update/:user_id/:job_id
jobsRouter.patch('/update/:user_id/:job_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const jobID = parseInt(req.params.job_id);
        const { title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, is_active, } = req.body;
        // Check if the user_id from the URL matches the user_id in the request body
        if (userID !== parseInt(req.body.user_id)) {
            return res.status(403).json({ error: 'Unauthorized: User ID in URL does not match user ID in request body.' });
        }
        // Call the updateJob function to update the job in the database
        const job = yield updateJob({
            id: jobID,
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
            user_id: userID,
            is_active,
        });
        res.send({
            message: 'Job updated successfully 😊',
            job,
        });
    }
    catch (error) {
        console.error('Error updating job', error);
        next(error);
    }
}));
// DELETE api/jobs/delete/:user_id/:job_id
jobsRouter.delete('/delete/:user_id/:job_id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.user_id);
        const jobID = parseInt(req.params.job_id);
        // Check if the user_id from the URL matches the user_id in the request body
        if (userID !== req.body.user_id) {
            return res.status(403).json({ error: 'Unauthorized: User ID in URL does not match user ID in request body.' });
        }
        // Call the deleteJob function to delete the job from the database
        const deletedJob = yield deleteJob(jobID);
        res.send({
            message: 'Job deleted successfully 😊',
            deletedJob,
        });
    }
    catch (error) {
        console.error('Error deleting job', error);
        next(error);
    }
}));
module.exports = jobsRouter;
