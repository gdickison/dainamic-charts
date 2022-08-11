// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryNatlPopulation(req, res) {
  const client = await pool.connect()

  await client
    .query(
      `SELECT SUM(total_population) AS national_population
      FROM banking_app.msa_summary_data`
    )
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting national population data: ", error))
}
