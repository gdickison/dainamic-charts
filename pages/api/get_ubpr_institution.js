import pool from "../../src/client";

export default async function queryUbprInstitution(req, res){
  const client = await pool.connect()

  await client
    .query(`SELECT
        *
      FROM banking_app.ubpr_institution
      WHERE LOWER("NAME") LIKE LOWER('%${req.body.nameParam}%')
        AND LOWER("SPECGRPN") LIKE LOWER('%${req.body.specializationParam}%')
        AND LOWER("STNAME") LIKE LOWER('%${req.body.stateParam}%')
        AND LOWER("CITY") LIKE LOWER('%${req.body.cityParam}%')
      ORDER BY "BANK_ID"`)
    .then(response => res.status(200).json({response: response.rows}))
    // .then(response => console.log('response', response))
    .then(client.release())
    .catch(error => console.log("There was an error getting ubpr data: ", error))
}