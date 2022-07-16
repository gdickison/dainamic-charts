// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        origination_date,
        unemployment_rate
      FROM banking_app.unemployment_rate
      WHERE msa IN (${req.body.msaCodes})
        AND origination_date >= '${req.body.startDate}'::date
        AND origination_date <= '${req.body.endDate}'::date
      ORDER BY msa`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
