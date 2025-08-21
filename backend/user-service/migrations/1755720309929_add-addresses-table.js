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
    pgm.createTable('addresses', {
        address_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        address_line1: { type: 'varchar(255)', notNull: true },
        address_line2: 'varchar(255)',
        city: { type: 'varchar(100)', notNull: true },
        state: 'varchar(100)',
        postal_code: 'varchar(20)',
        country: { type: 'varchar(100)', notNull: true },
        is_primary: { type: 'boolean', default: false },
        created_at: {
            type: 'timestamp with time zone',
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createIndex('addresses', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('addresses');
};
