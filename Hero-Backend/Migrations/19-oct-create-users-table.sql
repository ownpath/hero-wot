--Run these commands in the same order they are posted here. 


-- Create enum types
CREATE TYPE user_type AS ENUM ('user', 'admin', 'chairman');
CREATE TYPE user_type_enum AS ENUM ('family', 'friends', 'work colleagues');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_type NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_sign_in TIMESTAMP WITH TIME ZONE,
    google_id VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    refresh_token TEXT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    user_type user_type_enum
);

-- Create update_modified_column function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update_last_sign_in function
CREATE OR REPLACE FUNCTION update_last_sign_in(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET last_sign_in = CURRENT_TIMESTAMP
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create update_users_modtime trigger
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();