import pool from "../../src/client";

export default async function queryUbprRcon(req, res){
  const client = await pool.connect()

  const ubprs = `"${req.body.ubprCodes.join('","')}"`
  await client
    .query(`SELECT
        "QUARTER",
        ${ubprs}
      FROM banking_app.ubpr_credit_concentrations
      WHERE ("BANK_ID") IN (${req.body.bankIds})
        AND "QUARTER" BETWEEN '${req.body.quarterRange.startQuarter}' AND '${req.body.quarterRange.endQuarter}'
      ORDER BY "BANK_ID", "QUARTER"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error gettting the ubpr data: ", error))
}