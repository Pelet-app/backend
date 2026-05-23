/* eslint-disable camelcase */
import pool from '../../database/index.js';
import NotFoundError from '../../exceptions/not-found-error.js';

class ProfilesRepositories {
  constructor() {
    this.pool = pool;
  }

  async getProfileByUserIdWithSkills(userId) {
    const query = {
      text: `SELECT p.id, p.user_id, p.full_name, p.phone_number, p.address, p.avatar_url, p.applicant_data,
      p.hrd_data, p.updated_at, u.name, u.email, u.role, COALESCE(d.extracted_skills, '[]'::jsonb) AS extracted_skills
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) id, user_id, extracted_skills
        FROM documents
        WHERE user_id = $1
        ORDER BY user_id, id DESC
      ) d On d.user_id = p.user_id
      WHERE p.user_id = $1`,
      values: [userId]
    };

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Profil tidak ditemukan');
    }
    return result.rows[0];
  }

  async getProfileByUserId(userId) {
    const query = {
      text: `
        SELECT
          p.id,
          p.user_id,
          p.full_name,
          p.phone_number,
          p.address,
          p.avatar_url,
          p.applicant_data,
          p.hrd_data,
          p.updated_at,
          u.name,
          u.email,
          u.role
        FROM profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.user_id = $1
      `,
      values: [userId],
    };

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Profil tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateProfile(userId, role, payload) {
    const {
      fullName, phoneNumber, address, avatarUrl,
      applicantData, hrdData,
    } = payload;

    const setClauses = [];
    const values = [];
    let idx = 1;

    if (fullName !== undefined) { setClauses.push(`full_name    = $${idx++}`); values.push(fullName); }
    if (phoneNumber !== undefined) { setClauses.push(`phone_number = $${idx++}`); values.push(phoneNumber); }
    if (address !== undefined) { setClauses.push(`address      = $${idx++}`); values.push(address); }
    if (avatarUrl !== undefined) { setClauses.push(`avatar_url   = $${idx++}`); values.push(avatarUrl); }

    if (role === 'hrd' && hrdData) {
      // Hapus key undefined agar tidak masuk JSON sebagai null tak sengaja
      const patch = {};
      if (hrdData.companyName !== undefined) patch.company_name = hrdData.companyName;
      if (hrdData.position !== undefined) patch.position = hrdData.position;
      if (hrdData.companyWebsite !== undefined) patch.company_website = hrdData.companyWebsite;

      if (Object.keys(patch).length > 0) {
        setClauses.push(`hrd_data = hrd_data || $${idx++}::jsonb`);
        values.push(JSON.stringify(patch));
      }
    }

    if (role === 'user' && applicantData) {
      const patch = {};
      if (applicantData.bio !== undefined) patch.bio = applicantData.bio;
      if (applicantData.education !== undefined) patch.education = applicantData.education;
      if (applicantData.portfolioUrl !== undefined) patch.portfolio_url = applicantData.portfolioUrl;
      if (applicantData.linkedinUrl !== undefined) patch.linkedin_url = applicantData.linkedinUrl;

      if (Object.keys(patch).length > 0) {
        setClauses.push(`applicant_data = applicant_data || $${idx++}::jsonb`);
        values.push(JSON.stringify(patch));
      }
    }

    if (setClauses.length === 0) {
      throw new Error('Tidak ada field yang valid untuk diupdate');
    }

    setClauses.push('updated_at = NOW()');
    values.push(userId);

    const result = await pool.query({
      text: `
        UPDATE profiles
        SET    ${setClauses.join(', ')}
        WHERE  user_id = $${idx}
        RETURNING
          id, user_id, full_name, phone_number, address,
          avatar_url, applicant_data, hrd_data, updated_at
      `,
      values,
    });

    if (result.rowCount === 0) {
      throw new NotFoundError('Profil tidak ditemukan');
    }
    return result.rows[0];


  }
}
export default ProfilesRepositories;