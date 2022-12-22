import pool from "../../src/client";

export default async function queryUbprInstitution(req, res){
  const client = await pool.connect()

  await client
    .query(`SELECT
        DISTINCT "NAME", "BANK_ID"
      FROM banking_app.ubpr_institution
      ORDER BY "NAME"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error getting ubpr data: ", error))
}