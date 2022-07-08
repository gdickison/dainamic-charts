// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        a.msa,
        a.race_white AS "White",
        a.race_black AS "Black",
        a.race_native AS "Native American",
        a.race_asian AS "Asian",
        a.race_hawaiian AS "Pacific Islander",
        a.race_otherormore AS "Other/Mixed"
      FROM UNNEST('{${req.body.msaCodes}}'::INT[]) WITH ORDINALITY AS b(msa, order_nr)
      JOIN banking_app.population_by_race a USING (msa)
      ORDER BY b.order_nr;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting population by race data: ", error))
}
