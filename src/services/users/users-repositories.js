/* eslint-disable camelcase */
import pool from '../../database/index.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

class UserRepositories {
  constructor() {
    this.pool = pool;
  }

  async registerWithProfile({ id, name, email, hashedPassword, role, initialHrdData = {} }) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const checkEmail = await client.query({
        text: 'SELECT id FROM users WHERE email = $1',
        values: [email],
      });
      if (checkEmail.rowCount > 0) {
        throw new InvariantError('Email sudah terdaftar. Gunakan email lain.');
      }

      const userResult = await client.query({
        text: `INSERT INTO users(id, name, email, password, role) VALUES($1, $2, $3, $4, $5) 
        RETURNING id, name, email, role, created_at`,
        values: [id, name, email, hashedPassword, role],
      });
      const user = userResult.rows[0];

      const hrdDataJson = role === 'hrd' ? JSON.stringify({
        company_name: initialHrdData.companyName || '',
        position: initialHrdData.position || '',
        company_website: initialHrdData.companyWebsite || '',
      }) : '{}';

      const profileResult = await client.query({
        text: `INSERT INTO profiles(user_id, full_name, hrd_data, applicant_data) VALUES($1, $2, $3::jsonb, '{}'::jsonb) 
        RETURNING id, user_id, full_name, hrd_data, applicant_data, updated_at`,
        values: [user.id, name, hrdDataJson],
      });

      const profile = profileResult.rows[0];

      await client.query('COMMIT');
      return { user, profile };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email) {
    const query = {
      text: `SELECT  u.id, u.name, u.email, u.password, u.role, u.created_at,
      p.full_name, p.avatar_url, p.hrd_data, p.applicant_data
      FROM users u LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.email = $1`,
      values: [email],
    };
    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Email tidak ditemukan');
    }
    return result.rows[0];
  }

  async getUserById(id) {
    const query = {
      text: `SELECT u.id, u.name, u.email, u.role, u.created_at,
      p.id AS profile_id, p.full_name, p.phone_number, p.avatar_url, p.hrd_data, p.applicant_data, p.updated_at AS profile_updated_at
      FROM users u LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1`,
      values: [id],
    };
    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyEmailUnique(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this.pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Email sudah terdaftar. Gunakan email lain.');
    }
  }

}

export default UserRepositories;