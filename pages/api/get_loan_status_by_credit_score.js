// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryCreditScore(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
    MIN(origination_date) as "start_date",
    MAX(origination_date) as "end_date",
    msa AS "region",
    msa_name AS "region_name",
    COUNT(loan.loanid) AS "total",
    COUNT(loan.loanid) FILTER (WHERE loan.delinquency_status = '00') AS "current",
    COUNT(loan.loanid) FILTER (WHERE loan.delinquency_status != '00') AS "delinquent",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 580 AND borrower_credit_score <= 669 AND loan.delinquency_status = '00') AS "fair_current",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 580 AND borrower_credit_score <= 669 AND loan.delinquency_status != '00') AS "fair_delinquent",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 580 AND borrower_credit_score <= 669) AS "fair_total",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 670 AND borrower_credit_score <= 739 AND loan.delinquency_status = '00') AS "good_current",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 670 AND borrower_credit_score <= 739 AND loan.delinquency_status != '00') AS "good_delinquent",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 670 AND borrower_credit_score <= 739) AS "good_total",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 740 AND borrower_credit_score <= 799 AND loan.delinquency_status = '00') AS "very_good_current",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 740 AND borrower_credit_score <= 799 AND loan.delinquency_status != '00') AS "very_good_delinquent",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 740 AND borrower_credit_score <= 799) AS "very_good_total",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 800 AND loan.delinquency_status = '00') AS "exceptional_current",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 800 AND loan.delinquency_status != '00') AS "exceptional_delinquent",
    COUNT(loan.loanid) FILTER (WHERE borrower_credit_score >= 800) AS "exceptional_total"
  FROM
    banking_app.loan_basic as "loan"
    INNER JOIN banking_app.loan_credit_score AS "score"
      ON loan.loanid = score.loanid
    INNER JOIN banking_app.msa_names
      ON msa = msa_code
  WHERE msa IN (${req.body.msaCodes})
    AND origination_date >= '${req.body.startDate}'::date
    AND origination_date <= '${req.body.endDate}'::date
  GROUP BY msa, msa_name
  ORDER BY msa`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting delinquency by credit score data: ", error))
}
