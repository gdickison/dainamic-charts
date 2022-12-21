// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryDateOptions(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT DISTINCT "QUARTER"
      FROM banking_app.ubpr_credit_concentrations
      WHERE "QUARTER" IS NOT NULL
      ORDER BY "QUARTER";`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting quarters: ", error))
}