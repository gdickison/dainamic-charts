// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
      msa,
      region.msa_name AS "name",
      MIN(origination_date),
      MAX(origination_date),
      COUNT(loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent",
      COUNT(loanid) AS "total"
    FROM banking_app.loan_basic
      JOIN banking_app.msa_names AS "region"
      ON msa = region.msa_code
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
    GROUP BY msa, region.msa_name;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
