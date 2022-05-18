// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  pool
    .query(`select distinct
        race_white as "White",
        race_black as "Black",
        race_native as "Native American",
        race_asian as "Asian",
        race_hawaiian as "Pacific Islander",
        race_otherormore as "Other/Mixed"
      from data_refined.clean_data_19_21_v2
      where msa = ${req.body.msaCode} and origination_date >= '${req.body.startDate}'::date and origination_date <= '${req.body.endDate}'::date`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting population by race data: ", error))
}
