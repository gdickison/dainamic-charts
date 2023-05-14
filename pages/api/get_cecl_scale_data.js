import pool from "../../src/client";

export default async function queryCeclScale(req, res){
  const client = await pool.connect()

  const ceclQuery = `
    SELECT
      id,
      repdate,
      idrssd,
      rconf158,
      rconf159,
      rconf160,
      rconf161,
      rcon1460,
      rcon1797,
      rcon5367,
      rcon5368,
      rcon1420,
      rcon1766,
      rconb538,
      rconb539,
      rconk137,
      rconk207,
      rconj464
    FROM banking_app.call_sched_rcc1
    WHERE idrssd = 321152;
  `


  await client
    .query(ceclQuery)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There was an error getting financial data: ", error));
}