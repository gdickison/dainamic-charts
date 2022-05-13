// const { Client } = require('pg');

// const awsClient = new Client({
//   user: process.env.AWS_USERNAME,
//   database: process.env.AWS_DATABASE,
//   port: process.env.AWS_PORT,
//   host: process.env.AWS_HOST,
//   password: String(process.env.AWS_PASSWORD),
// })

// export default awsClient

const pg = require('pg')
const pool = new pg.Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  password: String(process.env.PGPASSWORD)
})

export default pool