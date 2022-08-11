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
      CAST(race.race_white AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "White",
      CAST(race.race_black AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Black",
      CAST(race.race_native AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Native American",
      CAST(race.race_asian AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Asian",
      CAST(race.race_hawaiian AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Pacific Islander",
      CAST(race.race_otherormore AS NUMERIC) * (ROUND(CAST(COUNT(loan.loanid) FILTER (WHERE delinquency_status !='00') AS NUMERIC)/COUNT(loan.loanid), 4) * 100) AS "Other/Mixed"
      FROM banking_app.loan_basic AS "loan"
        JOIN banking_app.msa_names AS "region"
          ON loan.msa = region.msa_code
        JOIN banking_app.population_by_race AS "race"
          ON loan.msa = race.msa
      WHERE loan.msa IN (${req.body.msaCodes})
      GROUP BY
        loan.msa,
        region.msa_name,
        race.race_white,
        race.race_black,
        race.race_native,
        race.race_asian,
        race.race_hawaiian,
        race.race_otherormore;`)
  .then(response => {
    res.status = 200
    res.end(res.json({response: response.rows}))
  })
  .then(client.release())
  .catch(error => {
    res.json(error)
    res.status(405).end()
    console.log("There is an error getting delinquency by race data: ", error)
  })
}
