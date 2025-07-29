import mysql, { RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT NOW()');
    connection.release();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Execute query with parameters
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const [rows, fields] = await pool.execute(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: Array.isArray(rows) ? rows.length : 1 });
    return { rows, fields };
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Get single result
export async function getOne(text: string, params?: any[]) {
  const result = await query(text, params);
  return (result.rows as RowDataPacket[])[0];
}

// Get multiple results
export async function getMany(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows as RowDataPacket[];
}

// Execute INSERT/UPDATE/DELETE queries
export async function execute(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows as ResultSetHeader;
}

export default pool; 