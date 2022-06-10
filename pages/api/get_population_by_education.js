// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        a.educ_lesshs AS "< High School Diploma",
        a.educ_somecoll AS "Some College",
        a.educ_college AS "College Degree",
        a.educ_collpl AS "College Post Grad"
      FROM UNNEST('{${req.body.msaCodes}}'::INT[]) WITH ORDINALITY AS b(msa, order_nr)
      JOIN banking_app.population_by_education a USING (msa)
      ORDER BY b.order_nr;`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
