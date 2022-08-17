// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function queryTopFeatures(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        msa_name AS "name",
        feat1 AS "feat01",
        feat2 AS "feat02",
        feat3 AS "feat03",
        feat4 AS "feat04",
        feat5 AS "feat05",
        feat6 AS "feat06",
        feat7 AS "feat07",
        feat8 AS "feat08",
        feat9 AS "feat09",
        feat10,
        feat11,
        feat12,
        feat13,
        feat14,
        feat15
      FROM data_refined.model_output_msa
        JOIN banking_app.msa_names
        ON msa = msa_code
      WHERE msa IN (${req.body.msaCodes})
      ORDER BY msa;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting top feature data: ", error))
}
