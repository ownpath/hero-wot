"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE post_status AS ENUM ('processing', 'accepted', 'rejected');
    `);

    await queryInterface.createTable("posts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ["processing", "accepted", "rejected"],
        allowNull: false,
        defaultValue: "processing",
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      media: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    });

    // Add check constraint for score
    await queryInterface.sequelize.query(`
      ALTER TABLE posts
      ADD CONSTRAINT posts_score_check
      CHECK (score IS NULL OR score >= 1 AND score <= 100);
    `);

    // Create index on status
    await queryInterface.addIndex("posts", ["status"], {
      name: "idx_posts_status",
    });

    // Create update_approved_at function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_approved_at()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
          NEW.approved_at = CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create validate_media_array function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION validate_media_array()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.media IS NOT NULL THEN
          IF jsonb_typeof(NEW.media) != 'array' THEN
            RAISE EXCEPTION 'media must be a JSON array';
          END IF;

          FOR i IN 0..jsonb_array_length(NEW.media) - 1 LOOP
            IF NOT (
              NEW.media->i ? 'type' AND
              NEW.media->i ? 'url' AND
              (NEW.media->i->>'type' IN ('image', 'video', 'audio'))
            ) THEN
              RAISE EXCEPTION 'Each media item must have a valid type (image, video, or audio) and url';
            END IF;

            IF NOT (NEW.media->i->>'url' ~ '^https?://') THEN
              RAISE EXCEPTION 'Invalid URL format in media item';
            END IF;
          END LOOP;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create set_approved_at trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER set_approved_at
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION update_approved_at();
    `);

    // Create update_posts_modtime trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_posts_modtime
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);

    // Create validate_media_trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER validate_media_trigger
      BEFORE INSERT OR UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION validate_media_array();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS validate_media_trigger ON posts;
      DROP TRIGGER IF EXISTS update_posts_modtime ON posts;
      DROP TRIGGER IF EXISTS set_approved_at ON posts;
      DROP FUNCTION IF EXISTS validate_media_array();
      DROP FUNCTION IF EXISTS update_approved_at();
      DROP INDEX IF EXISTS idx_posts_status;
      ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_score_check;
      DROP TYPE IF EXISTS post_status;
    `);
    await queryInterface.dropTable("posts");
  },
};
