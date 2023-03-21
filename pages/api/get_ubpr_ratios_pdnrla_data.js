import pool from "../../src/client";

export default async function queryUbprRcon(req, res){
  const client = await pool.connect()

  const codes = `"${req.body.pdnrlaCodes.join('","')}"`
  await client
    .query(`SELECT
        "peer_group_description",
        "peer_group",
        "QUARTER",
        ${codes}
      FROM banking_app.ubpr_stats_pdnrl
      WHERE peer_group IN (${req.body.peerGroupParam})
        AND "QUARTER" BETWEEN '${req.body.startingQuarter.value}' AND '${req.body.endingQuarter.value}'
      ORDER BY "peer_group", "QUARTER"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error gettting the pdnrl data: ", error))
}