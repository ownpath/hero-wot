"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE user_type AS ENUM ('user', 'admin', 'chairman');
      CREATE TYPE user_type_enum AS ENUM ('family', 'friends', 'work colleagues');
    `);

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.DataTypes.ENUM,
        values: ["user", "admin", "chairman"],
        allowNull: false,
        defaultValue: "user",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      last_sign_in: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      google_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      user_type: {
        type: Sequelize.DataTypes.ENUM,
        values: ["family", "friends", "work colleagues"],
        allowNull: true,
      },
    });

    // Create update_modified_column function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create update_last_sign_in function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_last_sign_in(user_id INTEGER)
      RETURNS VOID AS $$
      BEGIN
        UPDATE users
        SET last_sign_in = CURRENT_TIMESTAMP
        WHERE id = user_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create update_users_modtime trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_users_modtime
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_modtime ON users;
      DROP FUNCTION IF EXISTS update_modified_column();
      DROP FUNCTION IF EXISTS update_last_sign_in(INTEGER);
      DROP TYPE IF EXISTS user_type_enum;
      DROP TYPE IF EXISTS user_type;
    `);
    await queryInterface.dropTable("users");
  },
};
