// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {

  const client = await pool.connect()

  await client
    .query(`SELECT name
      FROM data_refined.msa_names
      WHERE cbsa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0].name}))
    .then(client.release())
    .catch(error => console.log("There is an error getting the msa name: ", error))
}
