// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`select distinct
        income_less15k as "Below $15K",
        income_15k29k as "$15K-$29K",
        income_30k39k as "$30K-$39K",
        income_40k49k as "$40K-$49K",
        income_50k59k as "$50K-$59K",
        income_60k99k as "$60K-$99K",
        income_100k149k as "$100K-$149K",
        income_over150k as "$150K & Above"
      from data_refined.clean_data_19_21_v2
      where msa = ${req.body.msaCode} and origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting data: ", error))
}
