// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  pool
    .query(`with temp_table as (select * from data_refined.clean_data_19_21_v2 order by origination_date)
      select distinct
        msa,
        name,
        total_population,
        population_density,
        median_home_income,
        median_home_value
      from temp_table
      where msa = ${req.body.msaCode} and origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting data: ", error))
}
