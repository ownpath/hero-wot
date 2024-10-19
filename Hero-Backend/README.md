````markdown
# Express.js Server Guide

This README provides instructions on how to set up an Express.js server locally and set up your database schema using two different methods: Sequelize migrations and raw SQL files.

## Table of Contents

1. [Setting Up Express.js Server](#setting-up-expressjs-server)

## Setting Up Express.js Server

### Prerequisites

- Node.js and npm installed on your machine
- Git installed (optional, for cloning the repository)

### Steps to Set Up and Run Express Server

1. Clone the repository (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add necessary environment variables:

   ```
   PORT=8080
   DATABASE_URL=postgres://username:password@localhost:5432/your_database_name
   ```

4. Start the server:

   ```bash
   npm start
   ```

   If you have a development script, you can use:

   ```bash
   npm run dev
   ```

5. Your server should now be running on `http://localhost:8080` (or whatever port you specified in the .env file).

### Testing the Server

To ensure your server is running correctly, you can:

1. Open a web browser and navigate to `http://localhost:8080`
2. Use a tool like cURL or Postman to send requests to your API endpoints

Example cURL command:

```bash
curl http://localhost:8080
```

If everything is set up correctly, you should see a response from your server.

````markdown
# Database Setup Guide

This README provides instructions on how to set up your database schema using two different methods: Sequelize migrations with Express.js and raw SQL files.

## Table of Contents

1. [Method 1: Sequelize Migrations with Express.js](#method-1-sequelize-migrations-with-expressjs)
2. [Method 2: Raw SQL Files](#method-2-raw-sql-files)

## Method 1: Sequelize Migrations with Express.js

### Prerequisites

- Node.js and npm installed
- PostgreSQL database set up and running

### Installation

1. Install required packages:

```bash
npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli
```
````

2. Initialize Sequelize in your project:

```bash
npx sequelize-cli init
```

This will create `config`, `models`, `migrations`, and `seeders` directories.

### Configuration

1. Update the `config/config.json` file with your database credentials:

```json
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "your_database_name",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
  // ... other environments
}
```

2. Place the migration files in the `migrations` directory:
   - `19-oct-create-users-table.js`
   - `19-oct-create-posts-table.js`

### Running Migrations

To apply the migrations and create the database schema:

```bash
npx sequelize-cli db:migrate
```

This will create the `users` and `posts` tables along with their associated functions and triggers.

To undo the last migration:

```bash
npx sequelize-cli db:migrate:undo
```

To undo all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

### Using Models in Your Express.js Application

1. Create model files for `User` and `Post` in the `models` directory.

2. In your Express.js application, you can use the models like this:

```javascript
const { User, Post } = require("./models");

// Example: Create a new user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Example: Get all posts for a user
app.get("/users/:userId/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
    });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Additional Commands

- Generate a new migration file:

```bash
npx sequelize-cli migration:generate --name migration-name
```

- Run migrations up to a specific file:

```bash
npx sequelize-cli db:migrate --to XXXXXXXXXXXXXX-migration-name.js
```

- Show all executed migrations:

```bash
npx sequelize-cli db:migrate:status
```

For more information on Sequelize and its usage with Express.js, refer to the [Sequelize documentation](https://sequelize.org/master/).

## Method 2: Raw SQL Files

### Prerequisites

- PostgreSQL installed and running
- psql command-line tool or any PostgreSQL client (e.g., pgAdmin)

### Files Description

1. `create_users_table.sql`: Contains SQL commands to create the `users` table, associated enum types, functions, and triggers.
2. `create_posts_table.sql`: Contains SQL commands to create the `posts` table, associated enum types, functions, and triggers.

### Using the SQL Files

1. Connect to your PostgreSQL database using psql:

   ```
   psql -U your_username -d your_database_name
   ```

2. Execute the SQL files in the following order:

   a. First, run the users table SQL:

   ```sql
   \i path/to/19-oct-create-users-table.sql
   ```

   b. Then, run the posts table SQL:

   ```sql
   \i path/to/19-oct-create-posts-table.sql
   ```

   Replace `path/to/` with the actual path to your SQL files.

3. Alternatively, you can copy and paste the contents of each SQL file directly into your psql session.

### Verifying the Setup

After running the SQL files, you can verify the setup:

1. List all tables:

   ```sql
   \dt
   ```

2. Describe the `users` table:

   ```sql
   \d users
   ```

3. Describe the `posts` table:

   ```sql
   \d posts
   ```

4. List all functions:

   ```sql
   \df
   ```

5. List all triggers:
   ```sql
   SELECT event_object_table AS table_name, trigger_name
   FROM information_schema.triggers
   WHERE trigger_schema = 'public'
   ORDER BY table_name, trigger_name;
   ```

### Modifying the Schema

If you need to modify the schema:

1. It's recommended to create new SQL files for alterations, e.g., `alter_users_table.sql`.
2. In these files, use `ALTER TABLE` statements to modify existing tables.
3. Run the new SQL files using the `\i` command as shown above.

Example of altering a table:

```sql
ALTER TABLE users ADD COLUMN new_column VARCHAR(50);
```

### Dropping the Schema

If you need to drop the entire schema and start over:

```sql
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS post_status;
DROP TYPE IF EXISTS user_type;
DROP TYPE IF EXISTS user_type_enum;
DROP FUNCTION IF EXISTS update_modified_column();
DROP FUNCTION IF EXISTS update_last_sign_in(INTEGER);
DROP FUNCTION IF EXISTS update_approved_at();
DROP FUNCTION IF EXISTS validate_media_array();
```

**CAUTION**: This will delete all data in these tables. Use with extreme caution, especially in a production environment.

For more information on PostgreSQL and SQL commands, refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/).

---

Remember to always backup your database before making significant changes or running migrations, especially in a production environment.

```

```
