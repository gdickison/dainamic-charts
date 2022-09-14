// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function querySampleEducation(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        *
      FROM banking_app.cex_sample_education
      WHERE date BETWEEN '${req.body.startDate}'::date AND '${req.body.endDate}'::date
        AND region != 0`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting cex sample education data: ", error))
}
