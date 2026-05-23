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
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },

    hrd_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },

    category_id: {
      type: 'VARCHAR(50)',
      references: 'categories(id)',
      onDelete: 'SET NULL',
    },

    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },

    description: {
      type: 'TEXT',
    },

    job_type: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'full-time',
      check: `
        job_type IN (
          'full-time',
          'part-time',
          'freelance',
          'internship'
        )
      `,
    },

    experience_level: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'entry',
      check: `
        experience_level IN (
          'entry',
          'mid',
          'senior'
        )
      `,
    },

    location_type: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'onsite',
      check: `
        location_type IN (
          'onsite',
          'remote',
          'hybrid'
        )
      `,
    },

    status: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: 'open',
      check: `
        status IN (
          'open',
          'closed'
        )
      `,
    },

    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('jobs');
};
