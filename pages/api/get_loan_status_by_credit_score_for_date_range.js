// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  // TODO set the query for the rest of the credit score columns
  return pool
    .query(`SELECT
        origination_date,
        SUM("580_669_total_for_period") AS "580_669_total_for_period",
        SUM("580_669_delinquent_for_period") AS "580_669_delinquent_for_period"
      FROM banking_app.delinquency_by_credit_score
      WHERE msa = ${req.body.msaCode}
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
      GROUP BY origination_date
      ORDER BY origination_date;`)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There is an error getting delinquency by credit score data: ", error))
}
