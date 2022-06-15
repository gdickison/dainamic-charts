// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
      a.msa,
      COUNT(a.loanid) FILTER(WHERE a.delinquency_status::INT != 00) AS "delinquent_msa",
      COUNT(a.loanid) AS "total_msa"
    FROM UNNEST('{${req.body.msaCodes}}'::INT[]) WITH ORDINALITY AS b(msa, order_nr)
    JOIN banking_app.loan_basic a USING (msa)
    WHERE a.origination_date >= '${req.body.startDate}'::date
      AND a.origination_date <= '${req.body.endDate}'::date
    GROUP BY b.order_nr, a.msa
    ORDER BY b.order_nr;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting total loan data: ", error))
}
