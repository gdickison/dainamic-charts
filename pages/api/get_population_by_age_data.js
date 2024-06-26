// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryPopulationByAge(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        msa_name AS "name",
        age_65pl_percent AS "65 and Over",
        age_45_64_percent AS "45-64",
        age_25_44_percent AS "25-44",
        age_18_24_percent AS "18-24",
        age_under18_percent AS "Under 18"
      FROM banking_app.population_by_age
        JOIN banking_app.msa_names
        ON msa = msa_code
      WHERE msa IN (${req.body.msaCodes})
      ORDER BY msa;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting population by age data: ", error))
}
