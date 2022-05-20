// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {

  pool.connect()

  pool
    .query(`select name
      from data_refined.msa_names
      where cbsa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0].name}))
    .catch(error => console.log("There is an error getting the msa name: ", error))
}
