// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryUnemploymentRate(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        r.msa_name AS "name",
        origination_date,
        unemployment_rate
      FROM banking_app.unemployment_rates
        JOIN banking_app.msa_names as "r"
          ON msa = r.msa_code
      WHERE msa IN (${req.body.msaCodes})
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
      ORDER BY msa`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
