import pool from "../../src/client";

export default async function queryUbprStats(req, res){
  const client = await pool.connect()

  const ubprStatsQuery = `
    SELECT
      *
    FROM banking_app.ubpr_stats_dummy_ubpse019
    WHERE peercode = '${req.body.selectedPeerParam}'
      AND TO_CHAR(period, 'yyyy-mm-dd') LIKE '%12-31%'
      ORDER BY period;
  `
  await client
    .query(ubprStatsQuery)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There was an error getting financial data: ", error));
}