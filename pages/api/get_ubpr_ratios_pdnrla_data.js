import pool from "../../src/client";

export default async function queryUbprRcon(req, res){
  const client = await pool.connect()

  const codes = `"${req.body.pdnrlaCodes.join('","')}"`
  await client
    .query(`SELECT
        t1."peer_group_description",
        t1."peer_group",
        t1."QUARTER",
        t2."BANK_ID",
        t2."PEER_GROUP",
        ${codes}
      FROM banking_app.ubpr_stats_pdnrl t1
        JOIN banking_app.ubpr_peer_groups t2
        ON t1."peer_group" = t2."PEER_GROUP"
      WHERE t1."peer_group" IN (${req.body.peerGroupParam})
        AND t2."BANK_ID" IN (${req.body.bankIdParam})
        AND t1."QUARTER" BETWEEN '${req.body.startingQuarter.value}' AND '${req.body.endingQuarter.value}'
      ORDER BY t2."BANK_ID", t1."QUARTER"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error gettting the pdnrl data: ", error))
}