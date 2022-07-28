// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        feat1,
        feat2,
        feat3,
        feat4,
        feat5
      FROM data_refined.model_output_msa
      WHERE msa IN (${req.body.msaCodes})
      ORDER BY msa;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting top feature data: ", error))
    // .query(`SELECT feat1, feat2, feat3, feat4, feat5
    //   FROM data_refined.model_output_msa
    //   WHERE msa = ${req.body.msaCode};`)
    // .then(response => res.status(200).json({response: response.rows[0]}))
    // .then(client.release())
    // .catch(error => console.log("There is an error getting top feature data: ", error))
}
