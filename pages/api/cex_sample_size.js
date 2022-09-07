// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function querySampleSize(req, res) {
  const client = await pool.connect()
console.log(req.body)
  await client
    .query(`SELECT
        date,
        region,
        region_name,
        sample_size
      FROM banking_app.cex_sample_size
      WHERE date BETWEEN '${req.body.startDate}'::date AND '${req.body.endDate}'::date
        AND region IN (${req.body.regions})
      GROUP BY date, region, region_name, sample_size
      ORDER BY region`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting cex sample size data: ", error))
}
