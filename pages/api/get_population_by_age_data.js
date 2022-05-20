// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`select distinct
        age_under18_percent as "Under 18",
        age_18_24_percent as "18-24",
        age_25_44_percent as "25-44",
        age_45_64_percent as "45-64",
        age_65pl_percent as "65 and Over"
      from data_refined.clean_data_19_21_v2
      where msa = ${req.body.msaCode} and origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting population by age data: ", error))
}
