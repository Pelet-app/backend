/* eslint-disable camelcase */
import pool from '../../database/index.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import AuthorizationError from '../../exceptions/authorization-error.js';

class ResumesRepositories {
  constructor() {
    this.pool = pool;
  }

  async createDocument({ id, userId, filename, path, cvText, compressedCv, created_at }) {
    const query = {
      text: `INSERT INTO documents (id, user_id, filename, path, cv_text, compressed_cv, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
      values: [id, userId, filename, path, cvText, compressedCv, created_at],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async getDocumentsByUser(userId) {
    const query = {
      text: `SELECT id, filename, path, cv_text, compressed_cv, user_id, created_at
             FROM documents
             WHERE user_id = $1
             ORDER BY id DESC`,
      values: [userId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT * FROM documents WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError(`Dokumen dengan id ${id} tidak ditemukan`);
    }
    return result.rows[0];
  }

  async verifyDocumentOwner(documentId, userId) {
    const query = {
      text: 'SELECT id FROM documents WHERE id = $1 AND user_id = $2',
      values: [documentId, userId],
    };
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError('Anda tidak memiliki izin untuk mengakses dokumen ini');
    }
  }

  async deleteDocument(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id, path',
      values: [id],
    };
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError(`Dokumen dengan id ${id} tidak ditemukan`);
    }
    return result.rows[0];
  }

  async getDocumentsByuserId(userId) {
    const query = {
      text: 'SELECT * FROM documents WHERE user_id = $1',
      values: [userId]
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

export default ResumesRepositories;