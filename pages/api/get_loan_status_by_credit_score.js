// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from '../../src/client'

export default function handler(req, res) {
  pool.connect()

  return pool
    .query(`select
        origination_date,
        count(loanid),
        count(loanid) filter (where borrower_credit_score <= 299) as "Under 300",
        count(loanid) filter (where borrower_credit_score between 300 and 579) as "300_579_total_for_period",
        count(loanid) filter (where (borrower_credit_score between 300 and 579) and deliquency_status = '00') as "300_579_current_for_period",
        count(loanid) filter (where (borrower_credit_score between 300 and 579) and deliquency_status != '00') as "300_579_delinquent_for_period",
        count(loanid) filter (where borrower_credit_score between 580 and 669) as "580_669_total_for_period",
        count(loanid) filter (where (borrower_credit_score between 580 and 669) and deliquency_status = '00') as "580_669_current_for_period",
        count(loanid) filter (where (borrower_credit_score between 580 and 669) and deliquency_status != '00') as "580_669_delinquent_for_period",
        count(loanid) filter (where borrower_credit_score between 670 and 739) as "670_739_total_for_period",
        count(loanid) filter (where (borrower_credit_score between 670 and 739) and deliquency_status = '00') as "670_739_current_for_period",
        count(loanid) filter (where (borrower_credit_score between 670 and 739) and deliquency_status != '00') as "670_739_delinquent_for_period",
        count(loanid) filter (where borrower_credit_score between 740 and 799) as "740_799_total_for_period",
        count(loanid) filter (where (borrower_credit_score between 740 and 799) and deliquency_status = '00') as "740_799_current_for_period",
        count(loanid) filter (where (borrower_credit_score between 740 and 799) and deliquency_status != '00') as "740_799_delinquent_for_period",
        count(loanid) filter (where borrower_credit_score >= 800) as "800_and_above_total_for_period",
        count(loanid) filter (where (borrower_credit_score >= 800) and deliquency_status = '00') as "800_and_above_current_for_period",
        count(loanid) filter (where (borrower_credit_score >= 800) and deliquency_status != '00') as "800_and_above_delinquent_for_period"
      from data_refined.clean_data_19_21_v2
      where msa = ${req.body.msaCode}
        and origination_date >= '${req.body.startDate}'::date
        and origination_date <= '${req.body.endDate}'::date
      group by origination_date
      order by origination_date;`)
    .then(response => res.status(200).json({response: response.rows}))
    .catch(error => console.log("There is an error getting top feature data: ", error))
}
