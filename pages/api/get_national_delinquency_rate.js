// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
    COUNT(loanid) AS "total_natl",
    COUNT(loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent_natl"
    FROM banking_app.loan_basic
    WHERE origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date;`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
