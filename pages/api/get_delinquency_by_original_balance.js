// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()
console.log('req', req)
  await client
    .query(`SELECT
      msa,
      original_upb,
      COUNT(loan.loanid) AS "total_loans",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS "delinquent",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status = '00') AS "current"
    FROM
      banking_app.loan_basic AS "loan"
      INNER JOIN banking_app.loan_original_upb AS "upb"
        ON loan.loanid = upb.loanid
    WHERE msa IN (${req.body.msaCodes})
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
    GROUP BY msa, original_upb;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting original balance data: ", error))
}
