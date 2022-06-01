// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        origination_date,
        SUM("580_669_total_for_period") AS "fair_total_for_period",
        SUM("580_669_delinquent_for_period") AS "fair_delinquent_for_period",
        SUM("670_739_total_for_period") AS "good_total_for_period",
        SUM("670_739_delinquent_for_period") AS "good_delinquent_for_period",
        SUM("740_799_total_for_period") AS "very_good_total_for_period",
        SUM("740_799_delinquent_for_period") AS "very_good_delinquent_for_period",
        SUM("800_and_above_total_for_period") AS "exceptional_total_for_period",
        SUM("800_and_above_delinquent_for_period") AS "exceptional_delinquent_for_period"
      FROM banking_app.delinquency_by_credit_score
      WHERE msa = ${req.body.msaCode}
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
      GROUP BY origination_date
      ORDER BY origination_date;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting delinquency by credit score data: ", error))
}
