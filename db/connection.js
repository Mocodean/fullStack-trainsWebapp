import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
  conectionLimit: 10,
  host: 'localhost',
  user: 'webprog_vonat',
  password: 'almakorte',
  database: 'Vonatok',
  port: 3306,
});

export default pool;
