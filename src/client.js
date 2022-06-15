const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  password: String(process.env.PGPASSWORD)
})

export default pool