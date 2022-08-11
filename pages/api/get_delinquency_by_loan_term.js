// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryLoanTerm(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      loan.msa,
      region.msa_name AS "name",
      loan_term,
      COUNT(loan.loanid) AS "total",
      COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT = 00) AS "current",
      COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT != 00) AS "delinquent"
    FROM
      banking_app.loan_basic AS "loan"
      JOIN banking_app.loan_term AS "term"
        ON loan.loanid = term.loanid
      JOIN banking_app.msa_names AS "region"
        ON loan.msa = region.msa_code
    WHERE msa IN (${req.body.msaCodes})
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
    GROUP BY loan.msa, region.msa_name, loan_term;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting loan term data: ", error))
}
