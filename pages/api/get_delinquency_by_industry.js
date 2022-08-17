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
      CAST(i.ind_agmining AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Ag/Mining",
      CAST(i.ind_const AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Construction",
      CAST(i.ind_manuf AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Manufacturing",
      CAST(i.ind_wholesale AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Wholesale Trade",
      CAST(i.ind_retail AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Retail Trade",
      CAST(i.ind_transport AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Transportation",
      CAST(i.ind_info AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Information",
      CAST(i.ind_fire AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Finance/Insurance/Real Estate",
      CAST(i.ind_pro AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Professional Services",
      CAST(i.ind_educhealth AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Education/Healthcare",
      CAST(i.ind_artentertain AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Arts/Entertainment",
      CAST(i.ind_public AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Public Sector",
      CAST(i.ind_otherserve AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Other"
    FROM banking_app.loan_basic AS "loan"
      JOIN banking_app.msa_names AS "region"
        ON loan.msa = region.msa_code
      JOIN banking_app.industry AS "i"
        ON loan.msa = i.msa
    WHERE loan.msa IN (${req.body.msaCodes})
    GROUP BY
      loan.msa,
      region.msa_name,
      i.ind_agmining,
      i.ind_const,
      i.ind_manuf,
      i.ind_wholesale,
      i.ind_retail,
      i.ind_transport,
      i.ind_info,
      i.ind_fire,
      i.ind_pro,
      i.ind_educhealth,
      i.ind_artentertain,
      i.ind_public,
      i.ind_otherserve
    ORDER BY loan.msa`)
  .then(response => {
    res.status = 200
    res.end(res.json({response: response.rows}))
  })
  .then(client.release())
  .catch(error => {
    res.json(error)
    res.status(405).end()
    console.log("There is an error getting delinquency by industry data: ", error)
  })
}
