// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  pool
    .query(`select distinct
        msa,
        name,
        total_population,
        population_density,
        median_home_income,
        median_home_value
      from data_refined.clean_data_19_21_v2
      where origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date and msa = ${req.body.msaCode} limit 10`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting data: ", error))
}
