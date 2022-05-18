// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {

  pool.connect()

  pool
    .query(`select count(loanid)
      from data_refined.clean_data_19_21_v2
      where msa = ${req.body.msaCode}
        and origination_date >= '${req.body.startDate}'::date
        and origination_date <= '${req.body.endDate}'::date
        and deliquency_status != '00';`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting delinquent loan data: ", error))
}
