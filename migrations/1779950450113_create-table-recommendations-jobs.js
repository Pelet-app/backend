/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('recommended_jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },

    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    document_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'documents(id)',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'jobs(id)',
      onDelete: 'CASCADE',
    },
    match_score: {
      type: 'NUMERIC(5,2)',
      notNull: true,
    },
    ai_analysis: {
      type: 'TEXT',
    },
    top_units: {
      type: 'JSONB',
      default: pgm.func('\'[]\'::jsonb'),
    },
    gap_units: {
      type: 'JSONB',
      default: pgm.func('\'[]\'::jsonb'),
    },
    matched_skills: {
      type: 'JSONB',
      default: pgm.func('\'[]\'::jsonb'),
    },
    missing_skills: {
      type: 'JSONB',
      default: pgm.func('\'[]\'::jsonb'),
    },
    kategori: {
      type: 'VARCHAR(50)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'recommended_jobs',
    'unique_user_job_recommendation',
    'UNIQUE(user_id, job_id)'
  );
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('recommended_jobs');
};
