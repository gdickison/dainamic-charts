// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`select feat1, feat2, feat3, feat4, feat5
      from data_refined.model_output_msa
      where msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .catch(error => console.log("There is an error getting top feature data: ", error))
}
