import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }, // Azure MySQL requires SSL — never set to false in production
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
})
