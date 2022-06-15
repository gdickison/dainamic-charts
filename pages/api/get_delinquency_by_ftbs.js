// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      origination_date,
      first_time_buyer_indicator,
      COUNT(loan.loanid) AS "total_loans",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS "delinquent",
      COUNT(loan.loanid) FILTER (WHERE delinquency_status = '00') AS "current"
    FROM
      banking_app.loan_basic AS "loan"
      INNER JOIN banking_app.loan_first_time_buyer AS "ftb"
        ON loan.loanid = ftb.loanid
    WHERE msa = ${req.body.msaCode}
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
    GROUP BY origination_date, first_time_buyer_indicator;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting FTSB data: ", error))
}
