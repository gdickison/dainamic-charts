// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../client'

export default async function handler(req, res) {
  const client = await pool.connect()

  await client
    .query(`SELECT
        income_less15k AS "Below $15K",
        income_15k29k AS "$15K-$29K",
        income_30k39k AS "$30K-$39K",
        income_40k49k AS "$40K-$49K",
        income_50k59k AS "$50K-$59K",
        income_60k99k AS "$60K-$99K",
        income_100k149k AS "$100K-$149K",
        income_over150k AS "$150K & Above"
      FROM banking_app.population_by_income
      WHERE msa = ${req.body.msaCode};`)
    .then(response => res.status(200).json({response: response.rows[0]}))
    .then(client.release())
    .catch(error => console.log("There is an error getting data: ", error))
}
