import pool from "../../src/client";

export default async function queryBankData(req, res){
  const client = await pool.connect()

  const bankQuery = req.body.selectedBanksParam.metric === "peer_group"
    ? `SELECT
        a."BANK_ID",
        a."PEER_GROUP",
        b.*
      FROM banking_app.ubpr_peer_groups a
        JOIN banking_app.ubpr_institution b
        ON a."BANK_ID" = b."BANK_ID"
      WHERE b."INSCOML" = 1
        AND a."PEER_GROUP" = ${req.body.selectedBanksParam.value}
      ORDER BY b."NAME"`
    : req.body.selectedBanksParam.metric === "state"
      ? `SELECT
          *
        FROM banking_app.ubpr_institution
        WHERE "INSCOML" = 1
          AND "STNAME" = '${req.body.selectedBanksParam.value}'
        ORDER BY "BANK_ID"`
      : `SELECT
           t1.*,
           t2."PEER_GROUP"
         FROM banking_app.ubpr_institution t1
          JOIN banking_app.ubpr_peer_groups t2
          ON t1."BANK_ID" = t2."BANK_ID"
         WHERE t1."INSCOML" = 1
           AND t1."BANK_ID" IN (${req.body.selectedBanksParam})
         ORDER BY "BANK_ID"`

  await client
    .query(bankQuery)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error getting bank data: ", error))
}