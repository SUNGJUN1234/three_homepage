const { pool } = require('../config/db');

const createExample = async (name) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query('INSERT INTO examples (name) VALUES (?)', [name]);
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); // 항상 연결을 반환합니다.
  }
};

const getExamples = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM examples');
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); // 항상 연결을 반환합니다.
  }
};

module.exports = {
  createExample,
  getExamples,
};
