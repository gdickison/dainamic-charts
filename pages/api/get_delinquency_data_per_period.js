// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryDelinquencyRate(req, res) {

  const client = await pool.connect()

  // TODO: refactor this to handle multiple regions
  await client
    .query(`SELECT
        msa,
        r.msa_name AS "name",
        origination_date,
        COUNT(loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent",
        COUNT(loanid) AS "total",
        ROUND(CAST(COUNT(loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loanid), 4) * 100 AS "delinquency_rate"
      FROM banking_app.loan_basic
        JOIN banking_app.msa_names as "r"
          ON msa = r.msa_code
      WHERE msa IN (${req.body.msaCodes})
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
      GROUP BY msa, r.msa_name, origination_date
      ORDER BY msa, origination_date;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
