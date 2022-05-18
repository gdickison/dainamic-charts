import pool from "../../src/client";

export default function handler(req, res) {
  pool.connect()

  pool
    .query(`select distinct male_percent from data_refined.clean_data_19_21_v2 where msa = ${req.body.msaCode}`)
    .then(response => res.status(200).json({response}))
    .catch(error => console.log("There was an error getting population by sex data: ", error))
}