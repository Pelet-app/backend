/* eslint-disable no-useless-assignment */
import pool from '../../database/index.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

class JobsRepositories {
  constructor() {
    this.pool = pool;
  }

  async createJob({ id, hrdId, categoryId, title, description, jobType, experienceLevel, locationType, status }) {
    const query = {
      text: `
        INSERT INTO jobs
          (id, hrd_id, category_id, title, description,
           job_type, experience_level, location_type, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      values: [
        id, hrdId, categoryId || null, title, description || null,
        jobType, experienceLevel, locationType, status,
      ],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobs({ status, jobType, experienceLevel, locationType, categoryId, search, page, limit }) {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (status) { conditions.push(`j.status           = $${idx++}`); values.push(status); }
    if (jobType) { conditions.push(`j.job_type         = $${idx++}`); values.push(jobType); }
    if (experienceLevel) { conditions.push(`j.experience_level = $${idx++}`); values.push(experienceLevel); }
    if (locationType) { conditions.push(`j.location_type    = $${idx++}`); values.push(locationType); }
    if (categoryId) { conditions.push(`j.category_id      = $${idx++}`); values.push(categoryId); }
    if (search) {
      conditions.push(`(j.title ILIKE $${idx} OR j.description ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    // Total rows untuk metadata pagination
    const { rows: [{ count }] } = await pool.query({
      text: `SELECT COUNT(*) FROM jobs j ${where}`,
      values,
    });

    // Query utama — JOIN ke profiles untuk ambil nama perusahaan HRD
    const { rows: jobs } = await pool.query({
      text: `
        SELECT
          j.id,
          j.hrd_id,
          j.title,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.status,
          j.created_at,
          u.name                              AS hrd_name,
          p.hrd_data->>'company_name'         AS company_name,
          p.hrd_data->>'company_website'      AS company_website,
          cat.id                              AS category_id,
          cat.name                            AS category_name
        FROM jobs j
        JOIN  users    u   ON j.hrd_id      = u.id
        LEFT JOIN profiles p   ON p.user_id     = u.id
        LEFT JOIN categories cat ON j.category_id = cat.id
        ${where}
        ORDER BY j.created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
      `,
      values: [...values, limit, offset],
    });

    return {
      jobs,
      pagination: {
        total: parseInt(count, 10),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count, 10) / limit),
      },
    };
  }

  async getJobById(id) {
    const result = await pool.query({
      text: `
        SELECT
          j.*,
          u.name                          AS hrd_name,
          u.email                         AS hrd_email,
          p.hrd_data->>'company_name'     AS company_name,
          p.hrd_data->>'company_website'  AS company_website,
          p.hrd_data->>'position'         AS hrd_position,
          cat.name                        AS category_name
        FROM jobs j
        JOIN  users      u   ON j.hrd_id      = u.id
        LEFT JOIN profiles   p   ON p.user_id     = u.id
        LEFT JOIN categories cat ON j.category_id = cat.id
        WHERE j.id = $1
      `,
      values: [id],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError(`Lowongan dengan id ${id} tidak ditemukan`);
    }
    return result.rows[0];
  }

  async updateJob(id, fields) {
    // Pemetaan camelCase → snake_case kolom yang boleh diupdate
    const keyMap = {
      categoryId: 'category_id',
      title: 'title',
      description: 'description',
      jobType: 'job_type',
      experienceLevel: 'experience_level',
      locationType: 'location_type',
      status: 'status',
    };

    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [camel, column] of Object.entries(keyMap)) {
      if (fields[camel] !== undefined) {
        setClauses.push(`${column} = $${idx++}`);
        values.push(fields[camel]);
      }
    }

    if (setClauses.length === 0) {
      throw new Error('Tidak ada field yang valid untuk diupdate');
    }

    values.push(id); // param terakhir untuk WHERE

    const result = await pool.query({
      text: `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    });

    if (result.rowCount === 0) {
      throw new NotFoundError(`Lowongan dengan id ${id} tidak ditemukan`);
    }
    return result.rows[0];
  }

  async deleteJob(id) {
    const result = await pool.query({
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError(`Lowongan dengan id ${id} tidak ditemukan`);
    }
    return result.rows[0];
  }

  async verifyJobOwner(jobId, userId) {
    const result = await pool.query({
      text: 'SELECT id FROM jobs WHERE id = $1 AND hrd_id = $2',
      values: [jobId, userId],
    });
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        'Anda tidak memiliki izin untuk memodifikasi lowongan ini'
      );
    }
  }

  async getJobsByHrdId(hrdId) {
    const result = await pool.query({
      text: `
        SELECT
          j.id, j.title, j.job_type, j.experience_level,
          j.location_type, j.status, j.created_at,
          cat.name AS category_name
        FROM jobs j
        LEFT JOIN categories cat ON j.category_id = cat.id
        WHERE j.hrd_id = $1
        ORDER BY j.created_at DESC
      `,
      values: [hrdId],
    });
    return result.rows;
  }
}

export default JobsRepositories;