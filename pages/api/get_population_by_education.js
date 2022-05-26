// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        educ_lesshs AS "< High School Diploma",
        educ_somecoll AS "Some College",
        educ_college AS "College Degree",
        educ_collpl AS "College Post Grad"
      FROM banking_app.population_by_education
      WHERE msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
