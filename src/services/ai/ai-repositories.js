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
          id,
          title,
          description
        FROM jobs
        WHERE status = 'open'
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
  }) {
    const query = {
      text: `
        INSERT INTO recommended_jobs (id, user_id, document_id, job_id, match_score, ai_analysis, top_units, gap_units)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)
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

        ORDER BY r.created_at ASC
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
}

export default AIRepositories;