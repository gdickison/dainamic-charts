// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      original_upb,
      COUNT(loanid) AS "total_loans",
      COUNT(original_upb) AS "total_at_upb",
      COUNT(original_upb) FILTER (WHERE deliquency_status !='00') AS "delinquent_at_upb",
      COUNT(original_upb) FILTER (WHERE deliquency_status = '00') AS "current_at_upb"
    FROM banking_app.delinquency_by_upb
    WHERE msa = ${req.body.msaCode}
      AND origination_date >= '${req.body.startDate}'::date
      AND origination_date <= '${req.body.endDate}'::date
    GROUP BY original_upb;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
