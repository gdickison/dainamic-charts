// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      loan.msa,
      region.msa_name AS "name",
      dti,
      COUNT(loan.loanid) AS "total",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS "delinquent",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status = '00') AS "current"
    FROM
      banking_app.loan_basic AS "loan"
      JOIN banking_app.loan_dti AS "dti"
        ON loan.loanid = dti.loanid
      JOIN banking_app.msa_names AS "region"
        ON loan.msa = region.msa_code
    WHERE msa IN (${req.body.msaCodes})
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
    GROUP BY loan.msa, region.msa_name, dti
    ORDER BY dti;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting dti data: ", error))
}