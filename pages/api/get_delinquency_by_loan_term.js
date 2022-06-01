// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      loan_term,
      COUNT(DISTINCT loanid) AS "total_loans",
      COUNT(loanid) FILTER(WHERE delinquency_status::INT = 00) AS "current",
      COUNT(loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent"
    FROM banking_app.delinquency_by_loan_term
    WHERE msa = ${req.body.msaCode}
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
    GROUP BY loan_term;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting loan term data: ", error))
}
