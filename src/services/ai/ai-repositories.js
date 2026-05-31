/* eslint-disable camelcase */
import pool from '../../database/index.js';

class AIRepositories {
  constructor() {
    this.pool = pool;
  }

  // Ambil latest compressed cv user
  async getLatestCompressedCv(user_id) {
    const query = {
      text: `
        SELECT
          id,
          compressed_cv
        FROM documents
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      values: [user_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async checkRecommendationExists(document_id) {
    const query = {
      text: `
      SELECT id
      FROM recommended_jobs
      WHERE document_id = $1
      LIMIT 1
    `,
      values: [document_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  // Ambil semua jobs open
  async getOpenJobs() {
    const query = {
      text: `
      SELECT
        j.id,
        j.title,
        j.description,
        j.hrd_id,

        u.name AS hrd_name,

        p.hrd_data->>'company_name' AS company_name,
        p.hrd_data->>'company_website' AS company_website,
        p.hrd_data->>'position' AS hrd_position

      FROM jobs j

      JOIN users u
        ON u.id = j.hrd_id

      LEFT JOIN profiles p
        ON p.user_id = u.id

      WHERE j.status = 'open'
    `,
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async createRecommendation({
    id,
    user_id,
    document_id,
    job_id,
    match_score,
    ai_analysis,
    top_units,
    gap_units,
    missing_skills,
    matched_skills,
    kategori,
  }) {
    const query = {
      text: `
        INSERT INTO recommended_jobs (id, user_id, document_id, job_id, match_score, ai_analysis, top_units, gap_units, missing_skills, matched_skills, kategori)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
      `,
      values: [
        id,
        user_id,
        document_id,
        job_id,
        match_score,
        ai_analysis,
        JSON.stringify(top_units),
        JSON.stringify(gap_units),
        JSON.stringify(missing_skills),
        JSON.stringify(matched_skills),
        kategori,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getRecommendationsByUserId(user_id) {
    const query = {
      text: `
      SELECT
        r.id,
        r.document_id,
        r.match_score,
        r.ai_analysis,
        r.top_units,
        r.gap_units,
        r.missing_skills,
        r.matched_skills,
        r.kategori,
        d.filename,

        j.id AS job_id,
        j.title,
        j.description,
        j.job_type,
        j.experience_level,
        j.location_type,
        j.status,

        u.id AS hrd_id,
        u.name AS hrd_name,

        p.hrd_data->>'company_name' AS company_name,
        p.hrd_data->>'company_website' AS company_website,
        p.hrd_data->>'position' AS hrd_position

      FROM recommended_jobs r

      JOIN jobs j
        ON j.id = r.job_id

      JOIN documents d
        ON d.id = r.document_id

      JOIN users u
        ON u.id = j.hrd_id

      LEFT JOIN profiles p
        ON p.user_id = u.id

      WHERE r.user_id = $1

      ORDER BY r.match_score DESC
    `,
      values: [user_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getRecommendationsByDocumentId(
    user_id,
    document_id
  ) {
    const query = {
      text: `
      SELECT
        r.id,
        r.match_score,
        r.ai_analysis,
        r.top_units,
        r.gap_units,
        r.missing_skills,
        r.matched_skills,
        r.kategori,
        d.filename,

        j.id AS job_id,
        j.title,
        j.description

      FROM recommended_jobs r

      JOIN jobs j
      ON j.id = r.job_id

      JOIN documents d
      ON d.id = r.document_id

      WHERE r.user_id = $1
      AND r.document_id = $2

      ORDER BY r.created_at ASC
    `,
      values: [user_id, document_id],
    };

    const result =
      await this.pool.query(query);

    return result.rows;
  }

  async getRecommendationById(user_id, recommendation_id) {
    const query = {
      text: `
      SELECT
        r.id,
        r.match_score,
        r.ai_analysis,
        r.top_units,
        r.gap_units,
        r.missing_skills,
        r.matched_skills,
        r.kategori,
        d.filename,

        j.id AS job_id,
        j.title,
        j.description

      FROM recommended_jobs r

      JOIN jobs j
      ON j.id = r.job_id

      JOIN documents d
      ON d.id = r.document_id

      WHERE r.user_id = $1
      AND r.id = $2

      ORDER BY r.created_at ASC
    `,
      values: [user_id, recommendation_id],
    };

    const result =
      await this.pool.query(query);

    return result.rows[0];
  }

  async getRecommendationByUserIdAndJobId(user_id, job_id) {
    const query = {
      text: `
      SELECT
        r.id,
        r.document_id,
        r.match_score,
        r.ai_analysis,
        r.top_units,
        r.gap_units,
        r.missing_skills,
        r.matched_skills,
        r.kategori,
        d.filename,

        j.id AS job_id,
        j.title,
        j.description

      FROM recommended_jobs r

      JOIN jobs j
      ON j.id = r.job_id

      JOIN documents d
      ON d.id = r.document_id

      WHERE r.user_id = $1
      AND r.job_id = $2

      ORDER BY r.created_at DESC
      LIMIT 1
    `,
      values: [user_id, job_id],
    };

    const result =
      await this.pool.query(query);

    return result.rows[0];
  }

  async getDocumentById(document_id) {
    const query = {
      text: `
        SELECT id, compressed_cv
        FROM documents
        WHERE id = $1
      `,
      values: [document_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getJobById(job_id) {
    const query = {
      text: `
        SELECT id, title, description
        FROM jobs
        WHERE id = $1
      `,
      values: [job_id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }
}


export default AIRepositories;