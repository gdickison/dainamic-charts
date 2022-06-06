// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
      SUM(delinquent_loans) AS "delinquent_natl",
      SUM(total_loans) AS "total_natl",
      SUM(delinquent_loans) FILTER (WHERE msa = ${req.body.msaCode}) AS "delinquent_msa",
      SUM(total_loans) FILTER(WHERE msa = ${req.body.msaCode}) AS "total_msa"
    FROM banking_app.delinquency_rate_raw_data
    WHERE origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date;`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
