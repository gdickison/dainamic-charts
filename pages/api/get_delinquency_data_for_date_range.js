// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {

  pool.connect()

  return pool
    .query(`SELECT
        SUM(delinquent_loans) AS "delinquent_loans",
        SUM(total_loans) AS "all_loans"
      FROM banking_app.delinquency_rate_raw_data
      WHERE msa = ${req.body.msaCode}
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date;`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
