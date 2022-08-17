// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryNatlMedianHomeValue(req, res) {
  const client = await pool.connect()

  await client
    .query(
      `SELECT
        PERCENTILE_CONT(0.5)
          WITHIN GROUP(ORDER BY median_home_value)
          AS national_median_home_value
      FROM banking_app.msa_summary_data`
    )
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting national home value data: ", error))
}
