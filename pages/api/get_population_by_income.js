// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        msa,
        msa_name AS "name",
        income_less15k AS "< $15K",
        income_15k29k AS "$15K-$29K",
        income_30k39k AS "$30K-$39K",
        income_40k49k AS "$40K-$49K",
        income_50k59k AS "$50K-$59K",
        income_60k99k AS "$60K-$99K",
        income_100k149k AS "$100K-$149K",
        income_over150k AS "$150K+"
      FROM banking_app.population_by_income
        JOIN banking_app.msa_names
        ON msa = msa_code
      WHERE msa IN (${req.body.msaCodes})
      ORDER BY msa;`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
