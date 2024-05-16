# MGMT

MGMT is an app designed to help users set and track their job applications. Users can create new job applications, track their progress, update application details, and delete applications when they are achieved or no longer relevant.

## Technologies

- Typescript
- Express.js
- PostgreSQL
- Node.js
- Xata (for database hosting)
- Render (for hosting the Express server)

## Installation

```bash
git clone git@github.com:vincentpalomo/MGMT.git
cd MGMT
npm install
```

## API Endpoints

### Jobs

- **Get All Jobs**: `GET /api/jobs`
- **Get Jobs by User ID**: `GET /api/jobs/user/:user_id`
- **Create Job**: `POST /api/jobs/create/:user_id`
- **Update Job (Admin)**: `PUT /api/jobs/update/:job_id`
- **Update Job by User ID**: `PUT /api/jobs/update/:user_id/:job_id`
- **Delete Job by User ID**: `DELETE /api/jobs/delete/:user_id/:job_id`

### Users

- **Get All Users**: `GET /api/users`
- **Get Jobs by User ID**: `GET /api/users/jobs/:user_id`
- **Get User by ID**: `GET /api/users/id/:user_id`
- **Get User by Username**: `GET /api/users/username`
- **Register User**: `POST /api/users/register`
- **Edit User**: `PATCH /api/users/edit/:user_id`
- **Deactivate User**: `DELETE /api/users/deactivate/:user_id`
- **Activate User**: `PATCH /api/users/activate/:user_id`

## Contributing

Contributions are welcome! Please follow the guidelines in the CONTRIBUTING.md file.

## License

This project is licensed under the MIT License.

```

```
