import pool from "../../src/client";

export default async function queryBankData(req, res){
  const client = await pool.connect()

  const bankParam = req.body.selectedBanksParam.metric === "peer_group"
    ? `${req.body.selectedBanksParam.value}`
    : req.body.selectedBanksParam.metric === "state"
      ? `AND "STNAME" = '${req.body.selectedBanksParam.value}'`
      : `AND "BANK_ID" IN (${req.body.selectedBanksParam})`

  await client
    .query(`SELECT
        *
      FROM banking_app.ubpr_institution
      WHERE "INSCOML" = 1
        ${bankParam}
      ORDER BY "BANK_ID"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error getting bank data: ", error))
}