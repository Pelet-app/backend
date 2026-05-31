/* eslint-disable camelcase */
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class ApplicationsRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createApplication({ user_id, job_id }) {
    const id = `applications-${nanoid()}`;
    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, user_id, job_id]
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyApplicationsExist({ user_id, job_id }) {
    const query = {
      text: 'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      values: [user_id, job_id]
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyJobExist(job_id) {
    const query = {
      text: `SELECT id FROM jobs 
      WHERE id=$1 AND status = 'open'`,
      values: [job_id]
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllMyApplications(user_id) {
    const query = {
      text: `
      SELECT
        a.id AS application_id, a.status, a.created_at AS applied_at,
        j.id AS job_id, j.title, j.description, j.job_type, j.location_type,
        c.name AS category_name,
        u.id AS hrd_id,
        u.name AS hrd_name,
        p.hrd_data
      FROM applications a
      JOIN jobs j
        ON j.id = a.job_id
      LEFT JOIN categories c
        ON c.id = j.category_id
      JOIN users u
        ON u.id = j.hrd_id
      LEFT JOIN profiles p
        ON p.user_id = u.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `,
      values: [user_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getMyApplicationsById({ application_id, user_id }) {
    const query = {
      text: `
      SELECT
        a.id AS application_id, a.status, a.created_at AS applied_at,
        j.id AS job_id, j.title, j.description, j.job_type, j.location_type, j.experience_level,
        c.name AS category_name,
        u.id AS hrd_id, u.name AS hrd_name,
        p.hrd_data
      FROM applications a
      JOIN jobs j
        ON j.id = a.job_id
      LEFT JOIN categories c
        ON c.id = j.category_id
      JOIN users u
        ON u.id = j.hrd_id
      LEFT JOIN profiles p
        ON p.user_id = u.id
      WHERE a.id = $1
      AND a.user_id = $2
    `,
      values: [application_id, user_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getAllApplicationsByJobId({ user_id, job_id }) {
    const query = {
      text: `
      SELECT
        a.id AS application_id,
        a.status,
        a.created_at AS applied_at,

        u.id AS applicant_id,
        u.name,
        u.email,

        p.full_name,
        p.phone_number,
        p.avatar_url,
        p.applicant_data,

        d.id AS document_id,
        d.path AS resume_path,
        d.extracted_skills,

        r.match_score

      FROM applications a

      JOIN jobs j
        ON j.id = a.job_id

      JOIN users u
        ON u.id = a.user_id

      LEFT JOIN profiles p
        ON p.user_id = u.id

      LEFT JOIN (
        SELECT DISTINCT ON (user_id)
          id,
          user_id,
          path,
          extracted_skills
        FROM documents
        ORDER BY user_id, created_at DESC
      ) d
        ON d.user_id = u.id

      LEFT JOIN recommended_jobs r
        ON r.user_id = a.user_id
        AND r.job_id = a.job_id

      WHERE a.job_id = $1
      AND j.hrd_id = $2

      ORDER BY
        r.match_score DESC NULLS LAST,
        a.created_at DESC
    `,
      values: [job_id, user_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getApplicationById({
    user_id,
    job_id,
    application_id,
  }) {
    const query = {
      text: `
      SELECT
        a.id AS application_id,
        a.status,
        a.created_at AS applied_at,

        u.id AS applicant_id,
        u.name,
        u.email,

        p.full_name,
        p.phone_number,
        p.address,
        p.avatar_url,
        p.applicant_data,

        d.id AS document_id,
        d.filename,
        d.path AS resume_path,
        d.cv_text,
        d.extracted_skills,

        r.match_score,
        r.ai_analysis,
        r.top_units,
        r.gap_units

      FROM applications a

      JOIN jobs j
        ON j.id = a.job_id

      JOIN users u
        ON u.id = a.user_id

      LEFT JOIN profiles p
        ON p.user_id = u.id

      LEFT JOIN (
        SELECT DISTINCT ON (user_id)
          id,
          user_id,
          filename,
          path,
          cv_text,
          extracted_skills
        FROM documents
        ORDER BY user_id, created_at DESC
      ) d
        ON d.user_id = u.id

      LEFT JOIN recommended_jobs r
        ON r.user_id = a.user_id
        AND r.job_id = a.job_id

      WHERE a.id = $1
      AND a.job_id = $2
      AND j.hrd_id = $3
    `,
      values: [application_id, job_id, user_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async updateStatusApplicationById({ user_id, application_id, status }) {
    const query = {
      text: `
      UPDATE applications
      SET status = $1
      FROM jobs j
      WHERE applications.id = $2
      AND applications.job_id = j.id
      AND j.hrd_id = $3
      RETURNING applications.id AS application_id, applications.status, applications.created_at AS applied_at
    `,
      values: [status, application_id, user_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  // async getApplicationById(id) {
  //   const query = {
  //     text: 'SELECT * FROM applications WHERE id = $1',
  //     values: [id],
  //   };

  //   const result = await this.pool.query(query);

  //   return result.rows[0];
  // }

  // async getApplicationsByUserId(userId) {
  //   const query = {
  //     text: 'SELECT * FROM applications WHERE user_id = $1',
  //     values: [userId],
  //   };

  //   const result = await this.pool.query(query);

  //   return result.rows;
  // }

  // async getApplicationsByJobId(jobId) {
  //   const query = {
  //     text: 'SELECT * FROM applications WHERE job_id = $1',
  //     values: [jobId],
  //   };

  //   const result = await this.pool.query(query);

  //   return result.rows;
  // }

  // async getAllApplications() {
  //   const query = {
  //     text: 'SELECT * FROM applications',
  //   };

  //   const result = await this.pool.query(query);

  //   return result.rows;
  // }

  // async updateApplication(id, { user_id, job_id, status }) {
  //   const query = {
  //     text: 'UPDATE applications SET user_id = $1, job_id = $2, status = $3 WHERE id = $4 RETURNING id',
  //     values: [user_id, job_id, status, id],
  //   };

  //   const result = await this.pool.query(query);
  //   return result.rows[0];
  // }

  // async deleteApplication(id) {
  //   const query = {
  //     text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
  //     values: [id],
  //   };

  //   const result = await this.pool.query(query);
  //   return result.rows[0];
  // }
}

export default ApplicationsRepositories;