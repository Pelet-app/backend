// /* eslint-disable camelcase */
// import { Pool } from 'pg';
// import { nanoid } from 'nanoid';

// class ApplicationsRepositories {
//   constructor() {
//     this.pool = new Pool();
//   }

//   async createApplication({ user_id, job_id, status }) {
//     const id = nanoid();
//     const query = {
//       text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
//       values: [id, user_id, job_id, status]
//     };

//     const result = await this.pool.query(query);
//     return result.rows[0];
//   }

//   async getApplicationById(id) {
//     const query = {
//       text: 'SELECT * FROM applications WHERE id = $1',
//       values: [id],
//     };

//     const result = await this.pool.query(query);

//     return result.rows[0];
//   }

//   async getApplicationsByUserId(userId) {
//     const query = {
//       text: 'SELECT * FROM applications WHERE user_id = $1',
//       values: [userId],
//     };

//     const result = await this.pool.query(query);

//     return result.rows;
//   }

//   async getApplicationsByJobId(jobId) {
//     const query = {
//       text: 'SELECT * FROM applications WHERE job_id = $1',
//       values: [jobId],
//     };

//     const result = await this.pool.query(query);

//     return result.rows;
//   }

//   async getAllApplications() {
//     const query = {
//       text: 'SELECT * FROM applications',
//     };

//     const result = await this.pool.query(query);

//     return result.rows;
//   }

//   async updateApplication(id, { user_id, job_id, status }) {
//     const query = {
//       text: 'UPDATE applications SET user_id = $1, job_id = $2, status = $3 WHERE id = $4 RETURNING id',
//       values: [user_id, job_id, status, id],
//     };

//     const result = await this.pool.query(query);
//     return result.rows[0];
//   }

//   async deleteApplication(id) {
//     const query = {
//       text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
//       values: [id],
//     };

//     const result = await this.pool.query(query);
//     return result.rows[0];
//   }
// }

// export default ApplicationsRepositories;