// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`SELECT DISTINCT
        origination_date,
        unemployment_rate
      FROM banking_app.unemployment_rate
      WHERE msa = ${req.body.msaCode} and origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date`)
    // .then(response => console.log(response.rows))
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There is an error getting data: ", error))
}
