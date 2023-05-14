import pool from "../../src/client";

export default async function queryUbprRatios(req, res){
  const client = await pool.connect()

  const ubprRatiosQuery = `
    SELECT
      *
    FROM banking_app.ubpr_ratios_dummy_ubpre019
    WHERE TO_CHAR(period, 'yyyy-mm-dd') LIKE '%12-31%'
    ORDER BY period;
  `
  await client
    .query(ubprRatiosQuery)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There was an error getting financial data: ", error));
}