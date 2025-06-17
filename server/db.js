const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'yourpassword', // replace with your real password
  port: 5432,
});

module.exports = pool;
