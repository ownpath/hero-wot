require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const { Pool } = require('pg');

const POSTGRES_URL = process.env.DATABASE_URL;

// Sequelize setup
const sequelize = new Sequelize(POSTGRES_URL);

// pg Pool setup
const pool = new Pool({
  connectionString: POSTGRES_URL,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database with Sequelize:', error);
  }
}

// Function to run direct queries using pg Pool
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

module.exports = {
  connectDB,
  sequelize,
  Sequelize,
  DataTypes,
  query,
};