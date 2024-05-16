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
// update job
const updateJob = (_b) => __awaiter(void 0, [_b], void 0, function* ({ id, title, company_name, jobURL, location, date_applied, application_status, interview_date, interview_type, salary, follow_up, notes, user_id, is_active, }) {
    try {
        const query = `
    UPDATE jobs
    SET title = $1,
        company_name = $2,
        jobURL = $3,
        location = $4,
        date_applied = $5,
        application_status = $6,
        interview_date = $7,
        interview_type = $8,
        salary = $9,
        follow_up = $10,
        notes = $11,
        user_id = $12,
        is_active = $13,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $14
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
            id,
        ];
        const { rows: [job], } = yield client_1.client.query(query, values);
        return job;
    }
    catch (error) {
        console.error('Error updating job:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
});
// delete job
const deleteJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
    DELETE FROM jobs
    WHERE id = $1
    RETURNING *;
    `;
        const values = [jobId];
        const { rows: [deletedJob], } = yield client_1.client.query(query, values);
        return deletedJob;
    }
    catch (error) {
        console.error('Error deleting job from DB', error);
        throw error;
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
    updateJob,
    deleteJob,
    getAllJobs,
    getJobByUserID,
};
