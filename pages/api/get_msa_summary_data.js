// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(
      `SELECT
        msa,
        name,
        total_population,
        population_density,
        median_home_income,
        median_home_value
      FROM banking_app.msa_summary_data
      WHERE msa IN (${req.body.msaCodes})
      ORDER BY msa`
    )
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting msa summary data: ", error))
}
