// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
    msa,
    MIN(origination_date),
    MAX(origination_date),
    COUNT(loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent",
    COUNT(loanid) AS "total"
  FROM banking_app.loan_basic
  WHERE
    msa IN (${req.body.msaCodes})
    AND origination_date >= (
      SELECT MIN(origination_date)
      FROM banking_app.loan_basic
    )
    AND origination_date <= (
      SELECT MAX(origination_date)
      FROM banking_app.loan_basic
    )
  GROUP BY msa;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
