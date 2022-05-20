// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`SELECT
        race_white AS "White",
        race_black AS "Black",
        race_native AS "Native American",
        race_asian AS "Asian",
        race_hawaiian AS "Pacific Islander",
        race_otherormore AS "Other/Mixed"
      FROM banking_app.population_by_race
      WHERE msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .catch(error => console.log("There is an error getting population by race data: ", error))
}
