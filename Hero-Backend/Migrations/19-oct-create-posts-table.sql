--Run these commands in the same order they are posted here. 


-- Create enum type for post status
CREATE TYPE post_status AS ENUM ('processing', 'accepted', 'rejected');

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status post_status NOT NULL DEFAULT 'processing',
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    media JSONB
);

-- Add check constraint for score
ALTER TABLE posts
ADD CONSTRAINT posts_score_check
CHECK (score IS NULL OR score >= 1 AND score <= 100);

-- Create index on status
CREATE INDEX idx_posts_status ON posts (status);

-- Create update_approved_at function
CREATE OR REPLACE FUNCTION update_approved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        NEW.approved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validate_media_array function
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

-- Create set_approved_at trigger
CREATE TRIGGER set_approved_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_approved_at();

-- Create update_posts_modtime trigger
CREATE TRIGGER update_posts_modtime
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create validate_media_trigger
CREATE TRIGGER validate_media_trigger
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION validate_media_array();