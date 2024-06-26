import pool from "../../src/client";

export default async function queryUbprRcon(req, res){
  const client = await pool.connect()

  const rcons = `"${req.body.rconCodes.join('","')}"`
  await client
    .query(`SELECT
        "BANK_ID",
        "QUARTER",
        ${rcons}
      FROM banking_app.ubpr_rcci
      WHERE ("BANK_ID") IN (${req.body.bankIdParam})
        AND "QUARTER" BETWEEN '${req.body.startingQuarter.value}' AND '${req.body.endingQuarter.value}'
      ORDER BY "BANK_ID", "QUARTER"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error gettting the rcon data: ", error))
}