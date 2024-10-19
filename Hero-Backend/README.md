Express.js Server

This Section provides instructions on how to set up and use Sequelize migrations with your Express.js server.

Alteratively you can follow the psql way of adding tables using the sql files. The instructions to those are mentioned

Table of Contents

Prerequisites
Installation
Configuration
Running Migrations
Using Models in Your Express.js Application
Additional Commands

Prerequisites

Node.js and npm installed
PostgreSQL database set up and running

Installation

Install required packages:

npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli

Initialize Sequelize in your project:

npx sequelize-cli init
This will create config, models, migrations, and seeders directories.
Configuration

Update the config/config.json file with your database credentials:

jsonCopy{
"development": {
"username": "your_username",
"password": "your_password",
"database": "your_database_name",
"host": "127.0.0.1",
"dialect": "postgres"
},
// ... other environments
}

Place the migration files in the migrations directory:

19-oct-create-users-table.js
19-oct-create-posts-table.js

Running Migrations
To apply the migrations and create the database schema:
npx sequelize-cli db:migrate
This will create the users and posts tables along with their associated functions and triggers.
To undo the last migration:
npx sequelize-cli db:migrate:undo
To undo all migrations:
npx sequelize-cli db:migrate:undo:all

SQL Files for Database Setup

This Section provides instructions on how to use the SQL files to set up your database schema directly in PostgreSQL.

Table of Contents

Prerequisites
Files Description
Using the SQL Files
Verifying the Setup
Modifying the Schema
Dropping the Schema

Prerequisites

PostgreSQL installed and running
psql command-line tool or any PostgreSQL client (e.g., pgAdmin)

Files Description

create_users_table.sql: Contains SQL commands to create the users table, associated enum types, functions, and triggers.
create_posts_table.sql: Contains SQL commands to create the posts table, associated enum types, functions, and triggers.

Using the SQL Files

Connect to your PostgreSQL database using psql:
psql -U your_username -d your_database_name

Execute the SQL files in the following order:
a. First, run the users table SQL:

\i path/to/create_users_table.sql

b. Then, run the posts table SQL:

\i path/to/create_posts_table.sql

Replace path/to/ with the actual path to your SQL files.

Alternatively, you can copy and paste the contents of each SQL file directly into your psql session.

Verifying the Setup
After running the SQL files, you can verify the setup:

List all tables:
\dt

Describe the users table:
\d users

Describe the posts table:
\d posts

List all functions:
\df

List all triggers:
SELECT event_object_table AS table_name, trigger_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY table_name, trigger_name;

Modifying the Schema
If you need to modify the schema:

It's recommended to create new SQL files for alterations, e.g., alter_users_table.sql.
In these files, use ALTER TABLE statements to modify existing tables.
Run the new SQL files using the \i command as shown above.

Example of altering a table:
ALTER TABLE users ADD COLUMN new_column VARCHAR(50);
Dropping the Schema
If you need to drop the entire schema and start over:
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS post_status;
DROP TYPE IF EXISTS user_type;
DROP TYPE IF EXISTS user_type_enum;
DROP FUNCTION IF EXISTS update_modified_column();
DROP FUNCTION IF EXISTS update_last_sign_in(INTEGER);
DROP FUNCTION IF EXISTS update_approved_at();
DROP FUNCTION IF EXISTS validate_media_array();

CAUTION: This will delete all data in these tables. Use with extreme caution, especially in a production environment.
Remember to always backup your database before making significant changes.
For more information on PostgreSQL and SQL commands, refer to the PostgreSQL documentation.
