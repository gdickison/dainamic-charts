import pool from "../../src/client";

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT male_percent
      FROM banking_app.population_by_sex
      WHERE msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0].male_percent}))
    .then(client.release())
    .catch(error => console.log("There was an error getting population by sex data: ", error))
}