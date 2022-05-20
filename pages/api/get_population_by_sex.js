import pool from "../../src/client";

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`SELECT male_percent
      FROM banking_app.population_by_sex
      WHERE msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0].male_percent}))
    .catch(error => console.log("There was an error getting population by sex data: ", error))
}