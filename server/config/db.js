const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  acquireTimeout: 30000,
  connectTimeout: 10000,
  idleTimeout: 5000,
  timeout: 10000,
  compress: true,
  charset: 'utf8mb4'
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MariaDB connected');
    connection.release();
  } catch (error) {
    console.error('MariaDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
