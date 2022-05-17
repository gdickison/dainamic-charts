import { useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import { Line } from "react-chartjs-2"

const DelinquencyRateByDemographic = ({ msaOptions, monthOptions }) => {
  const [queryParams, setQueryParams] = useState({})
  const [msaDemographicData, setMsaDemographicData] = useState()
  const [unemploymentRateData, setUnemploymentRateData] = useState()
  const unemploymentChartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "red",
        // fill: "start",
        // backgroundColor: "rgba(47,97,68,0.3)"
      },
      point: {
        radius: 0,
        hitRadius: 0
      }
    },
    // scales: {
    //   xAxis: {
    //     display: false
    //   },
    //   yAxis: {
    //     display: false
    //   }
    // }
  }

  const handleChange = e => {
    e.preventDefault()
    setQueryParams({...queryParams, [e.target.name]: e.target.value})
  }

  const getUnemploymentRate = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_unemployment_rate`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    let status = response.status
    let data = await response.json()

    if(status === 404){
      console.log("There was an error getting the unemployment rate")
    } else if(status === 200){
      const unemploymentRateLabels = []
      data.response.rows.map(row => {
        unemploymentRateLabels.push(row.origination_date.split('T')[0])
      })

      const unemploymentRates = []
      data.response.rows.map(row => {
        unemploymentRates.push(row.unemployment_rate)
      })
      console.log(unemploymentRates)
      setUnemploymentRateData({
        labels: unemploymentRateLabels,
        datasets: [
          {
            label: "Unemployment Rate",
            data: unemploymentRates
          }
        ]
      })
      // setUnemploymentRate(data.response.rows)
    }
  }

  const getDemographicData = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/demographic_data`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    let status = response.status
    let demographicData = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMsaDemographicData(demographicData.response.rows[0])
    }
  }

  const getTotalLoansPerPeriod = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_total_loans_per_period`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    let status = response.status
    let totalLoans = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      console.log(totalLoans)
    }
  }

  const getDelinquentLoansPerPeriod = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_delinquent_loans_per_period`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    let status = response.status
    let delinquentLoans = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      console.log(delinquentLoans)
    }
  }

  const getData = async () => {
    console.log(queryParams)
    if(!queryParams.msaCode ){
      // TODO: use an alert like the one I built for RedBalloon
      alert("pick an msa")
    }

    getUnemploymentRate()
    getDemographicData()
    getTotalLoansPerPeriod()
    getDelinquentLoansPerPeriod()
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="my-6 text-7xl">Delinquency Rate By Demographic</h1>
      <p className="mx-12">Demographics would be at the aggregate level to what we have. Say, if users select  have People with less than HS, in certain industry, etc. within a certain time period, we should show then the deliquency rate for that subset.</p>
      <form action="#">
        <label htmlFor="startDate">Select a start date: </label>
        {/* TODO: format the entered date - can I enforce a format? */}
        {/* TODO: show an alert if date is outside range */}
        <select id="startDate" name="startDate" defaultValue="" onChange={handleChange}>
          <option disabled></option>
          {monthOptions && monthOptions.map(month => {
            return (
              <option key={month.origination_date} value={month.origination_date}>{month.origination_date}</option>
            )
          })}
        </select>
        <label htmlFor="endDate">Select an end date: </label>
        <select id="endDate" name="endDate" defaultValue="" onChange={handleChange}>
          <option disabled></option>
          {monthOptions && monthOptions.map(month => {
            return (
              <option key={month.origination_date} value={month.origination_date}>{month.origination_date}</option>
            )
          })}
        </select>
        <label htmlFor="msaCode">Select an MSA: </label>
        <select id="msaCode" name="msaCode" defaultValue="" onChange={handleChange}>
          <option disabled></option>
          {msaOptions && msaOptions.map(singleMsa => {
            return (
              <option key={singleMsa.msa} value={singleMsa.msa}>{singleMsa.msa} - {singleMsa.name}</option>
            )
          })}
        </select>
      </form>
      <button onClick={getData}>Get Some Data</button>
      {/* TODO: pull data that changes over time and show the start/finish points, e.g. start unemployment rate - end unemployment rate */}
      <div>
        {unemploymentRateData && msaDemographicData &&
          <div>
            {console.log(unemploymentRateData)}
            <p>The unemployment rate in {msaDemographicData.name} </p>
            <Line data={unemploymentRateData} width={500} height={250} options={unemploymentChartOptions} />
          </div>
        }
        {msaDemographicData &&
          <div>
          {console.log(msaDemographicData)}
          {msaDemographicData.length > 1
            ? <p>MSA Demographic Length = {msaDemographicData.length}</p>
            : <div>
                <p>MSA Demographic Length is 1</p>
                <p>Selected MSA: {msaDemographicData.name}</p>
                <p>Total Population: {(msaDemographicData.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                <p>Median Home Income: {(msaDemographicData.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</p>
                <p>Median Home Value: {(msaDemographicData.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</p> 
              </div>
          }
          </div>
        }
      </div>
    </div>
  )
}

export default DelinquencyRateByDemographic

export const getStaticProps = async () => {
  // get the MSAs to generate the MSA select input options
  const pg = require('pg')
  const pool = new pg.Pool({
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    password: String(process.env.PGPASSWORD)
  })

  // TODO: find a better way to populate the msa options - this takes too long
  const msaResponse = await pool.query(`select distinct msa, name from data_refined.clean_data_19_21_v2 order by msa`)
  const monthResponse = await pool.query(`select distinct origination_date from data_refined.clean_data_19_21_v2 order by origination_date`)
  for(const month of monthResponse.rows){
    month.origination_date = month.origination_date.toISOString().split('T')[0]
  }

  return {
    props: {
      msaOptions: msaResponse.rows,
      monthOptions: monthResponse.rows,
    },
  }
}