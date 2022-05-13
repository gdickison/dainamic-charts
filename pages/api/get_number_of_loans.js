// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {

  pool.connect()

  pool
    .query(`select count(*) from data_refined.clean_data_19_21_v2`)
    .then(response => console.log(response))
    // .then(response => res.status(200).json({response}))
    .catch(error => console.log("There is an error getting data: ", error))

  // res.status(200).json({ name: 'John Doe' })
}
