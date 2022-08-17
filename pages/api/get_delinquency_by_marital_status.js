// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryPopulationByRace(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
      loan.msa,
      region.msa_name AS "name",
      MIN(origination_date),
      MAX(origination_date),
      COUNT(loan.loanid) FILTER(WHERE delinquency_status::INT != 00) AS "delinquent",
      COUNT(loan.loanid) AS "total",
      ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100 AS "delinquency_rate",
      CAST(m.married AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Married",
      CAST((1 - m.married) AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Unmarried"
      FROM banking_app.loan_basic AS "loan"
        JOIN banking_app.msa_names AS "region"
          ON loan.msa = region.msa_code
        JOIN banking_app.marital_status AS "m"
          ON loan.msa = m.msa
      WHERE loan.msa IN (${req.body.msaCodes})
      GROUP BY
        loan.msa,
        region.msa_name,
        m.married
      ORDER BY
        loan.msa`)
  .then(response => {
    res.status = 200
    res.end(res.json({response: response.rows}))
  })
  .then(client.release())
  .catch(error => {
    res.json(error)
    res.status(405).end()
    console.log("There is an error getting delinquency by marital status data: ", error)
  })
}
