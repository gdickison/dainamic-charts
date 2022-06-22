// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  // await client
  //   .query(`SELECT
  //   a.msa,
  //   c.interest_rate,
  //   COUNT(a.loanid) AS "total_loans",
  //   COUNT(a.loanid) FILTER(WHERE a.delinquency_status::INT = 00) AS "current",
  //   COUNT(a.loanid) FILTER(WHERE a.delinquency_status::INT != 00) AS "delinquent"
  // FROM UNNEST('{${req.body.msaCodes}}'::INT[]) WITH ORDINALITY AS b(msa, order_nr)
  //   INNER JOIN banking_app.loan_basic a USING (msa)
  //   INNER JOIN banking_app.loan_interest_rate c ON a.loanid = c.loanid
  // WHERE a.origination_date >= '${req.body.startDate}'::date
  //   AND a.origination_date <= '${req.body.endDate}'::date
  // GROUP BY a.msa, c.interest_rate, b.order_nr
  // ORDER BY b.order_nr;`)
  //   .then(response => res.status(200).json({response: response.rows}))
  //   .then(client.release())
  //   .catch(error => console.log("There is an error getting interest rate data: ", error))
  await client
    .query(`SELECT
    msa,
    interest_rate,
    COUNT(loan.loanid) AS "total_loans",
    COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT = 00) AS "current",
    COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT != 00) AS "delinquent"
  FROM
    banking_app.loan_basic AS loan
    INNER JOIN banking_app.loan_interest_rate AS interestrate
      ON loan.loanid = interestrate.loanid
  WHERE msa IN (${req.body.msaCodes})
    AND origination_date >= '${req.body.startDate}'::date
    AND origination_date <= '${req.body.endDate}'::date
  GROUP BY msa, interest_rate;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting interest rate data: ", error))
}
