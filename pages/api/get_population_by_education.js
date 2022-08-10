// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  pool
    .query(`SELECT
      loan.msa,
      region.msa_name AS "name",
      MIN(origination_date),
      MAX(origination_date),
      COUNT(loan.loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent",
      COUNT(loan.loanid) AS "total",
      ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100 AS "delinquency_rate",
      CAST(ed.educ_lesshs AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "< High School Diploma",
      CAST(ed.educ_somecoll AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Some College",
      CAST(ed.educ_college AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "College Degree",
      CAST(ed.educ_collpl AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "College Post Grad"
    FROM banking_app.loan_basic AS "loan"
      JOIN banking_app.msa_names AS "region"
        ON loan.msa = region.msa_code
      JOIN banking_app.population_by_education AS "ed"
        ON loan.msa = ed.msa
    WHERE
      loan.msa IN (${req.body.msaCodes})
      AND origination_date >= (
        SELECT MIN(origination_date)
        FROM banking_app.loan_basic
      )
      AND origination_date <= (
        SELECT MAX(origination_date)
        FROM banking_app.loan_basic
      )
    GROUP BY
      loan.msa,
      region.msa_name,
      ed.educ_lesshs,
      ed.educ_somecoll,
      ed.educ_college,
      ed.educ_collpl;`)
  .then(response => res.status(200).json({response: response.rows}))
  .catch(error => {
    setImmediate(() => {
      throw error
    })
  })
}
