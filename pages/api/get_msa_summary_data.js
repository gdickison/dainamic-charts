// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(
      `SELECT
        a.msa,
        a.name,
        a.total_population,
        a.median_home_income,
        a.median_home_value
      FROM UNNEST('{${req.body.msaCodes}}'::INT[]) WITH ORDINALITY AS b(msa, order_nr)
      JOIN banking_app.msa_summary_data a USING (msa)
      ORDER BY b.order_nr`
    )
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting msa summary data: ", error))
}
