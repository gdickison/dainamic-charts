import pool from "../../src/client";

export default async function queryPeerOptions(req, res){
  const client = await pool.connect()

  const peerQuery = `
    SELECT
      DISTINCT peername, peercode
    FROM banking_app.ubpr_stats_dummy_ubpse019
    WHERE LOWER(peername) LIKE '%commercial%'
    ORDER BY peername;
  `
  await client
    .query(peerQuery)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There was an error getting peer group data: ", error));
}