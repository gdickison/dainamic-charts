// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
    msa AS "region",
    msa_name AS "region_name",
    COUNT(loan.loanid) AS "total_loans",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers = 1) AS "one_borrower_total",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers = 1 AND delinquency_status = '00') AS "one_borrower_current",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers = 1 AND delinquency_status != '00') AS "one_borrower_delinquent",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers > 1) AS "multi_borrower_total",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers > 1 AND delinquency_status = '00') AS "multi_borrower_current",
    COUNT(num_borrowers) FILTER (WHERE num_borrowers > 1 AND delinquency_status != '00') AS "multi_borrower_delinquent",
    COUNT(loan.loanid) FILTER (WHERE delinquency_status = '00') AS "total_current",
    COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS "total_delinquent"
  FROM
    banking_app.loan_basic AS "loan"
    INNER JOIN banking_app.loan_num_borrowers AS "borrowers"
      ON loan.loanid = borrowers.loanid
    INNER JOIN banking_app.msa_names
      ON msa = msa_code
    WHERE msa IN (${req.body.msaCodes})
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
  GROUP BY msa, msa_name;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting number of borrowers data: ", error))
  // await client
  //   .query(`SELECT
  //     origination_date,
  //     num_borrowers,
  //     COUNT(loan.loanid) AS "total_loans",
  //     COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT = 00) AS "current",
  //     COUNT(loan.loanid) FILTER(WHERE loan.delinquency_status::INT != 00) AS "delinquent"
  //   FROM
  //     banking_app.loan_basic AS loan
  //     INNER JOIN banking_app.loan_num_borrowers AS borrowers
  //       ON loan.loanid = borrowers.loanid
  //   WHERE msa = ${req.body.msaCode}
  //     AND origination_date >= '${req.body.startDate}'::date
  //     AND origination_date <= '${req.body.endDate}'::date
  //     AND num_borrowers < 3
  //   GROUP BY origination_date, num_borrowers;`)
  //   .then(response => res.status(200).json({response: response.rows}))
  //   .then(client.release())
  //   .catch(error => console.log("There is an error getting number of borrowers data: ", error))
}
