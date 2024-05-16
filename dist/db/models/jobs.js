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
const client_1 = require("../client");
// create jobs
const createJob = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, }) {
    try {
        console.log(user_id);
        const query = `
    INSERT INTO jobs (title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
    `;
        const values = [
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
        ];
        const { rows: [job], } = yield client_1.client.query(query, values);
        return job;
    }
    catch (error) {
        console.error('Error creating job:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
});
// get all jobs
const getAllJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: jobs } = yield client_1.client.query(`
    SELECT * FROM jobs
    `);
        return jobs;
    }
    catch (error) {
        console.error('Error retreiving jobs from DB', error);
    }
});
// get job by user id
const getJobByUserID = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield getAllJobs();
    return job === null || job === void 0 ? void 0 : job.filter((j) => j.user_id === user_id);
});
module.exports = {
    createJob,
    getAllJobs,
    getJobByUserID,
};
