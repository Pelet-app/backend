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
  pgm.createTable('profiles', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },

    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },

    full_name: {
      type: 'VARCHAR(255)',
    },

    phone_number: {
      type: 'VARCHAR(30)',
    },

    address: {
      type: 'TEXT',
    },

    avatar_url: {
      type: 'TEXT',
    },

    applicant_data: {
      type: 'JSONB',
      notNull: true,
      default: '{}',
    },

    hrd_data: {
      type: 'JSONB',
      notNull: true,
      default: '{}',
    },

    updated_at: {
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
  pgm.dropTable('profiles');
};
