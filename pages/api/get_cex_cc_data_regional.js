// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryCexRegionalCCData(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        *
      FROM banking_app.cex_cc_data_by_region_month`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting cex credit card data: ", error))
}
