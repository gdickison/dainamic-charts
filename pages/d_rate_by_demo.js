import { useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
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
  ArcElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import { Line, Doughnut, Bar } from "react-chartjs-2"

const DelinquencyRateByDemographic = ({ msaOptions, monthOptions }) => {
  const [queryParams, setQueryParams] = useState({})
  const [msaDemographicData, setMsaDemographicData] = useState()
  const [totalLoans, setTotalLoans] = useState()
  const [delinquentLoans, setDelinquentLoans] = useState()
  const [delinquencyRatePerPeriod, setDelinquencyRatePerPeriod] = useState()
  const [unemploymentRateData, setUnemploymentRateData] = useState()
  const [populationByAgeData, setPopulationByAgeData] = useState()
  const [populationByIncomeData, setPopulationByIncomeData] = useState()
  const [populationBySex, setPopulationBySex] = useState()
  const [populationByRace, setPopulationByRace] = useState()

  const handleChange = e => {
    e.preventDefault()
    setQueryParams({...queryParams, [e.target.name]: e.target.value})
  }

  // Unemployment Rate Chart
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
      // console.log(unemploymentRates)
      setUnemploymentRateData({
        labels: unemploymentRateLabels,
        datasets: [
          {
            label: "Monthly Unemployment Rate",
            data: unemploymentRates
          }
        ]
      })
    }
  }

  const unemploymentChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Unemployment Rate',
        align: 'start',
        font: {
          size: 20
        }
      },
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "red",
        fill: "start",
        backgroundColor: "pink"
      },
      point: {
        radius: 5,
        hitRadius: 5
      }
    }
  }

  // Population by Age Chart
  const getPopulationByAgeData = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_population_by_age_data`
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
      console.log("There was an error getting the population by age")
    } else if(status === 200) {
      // console.log(data.response.rows[0])
      const populationByAgeLabels = []
      const populationByAge = []
      for(const [key, value] of Object.entries(data.response.rows[0])){
        populationByAgeLabels.push(key)
        populationByAge.push(parseFloat(value * 100).toFixed(2))
      }
      // console.log('populationByAgeLabels', populationByAgeLabels)
      // console.log('populationByAge', populationByAge)
      setPopulationByAgeData({
        backgroundColor: [
          "red",
          "blue",
          "green",
          "orange",
          "purple"
        ],
        labels: populationByAgeLabels,
        datasets: [
          {
            label: "Population by Age",
            data: populationByAge,
            backgroundColor: [
              "red",
              "blue",
              "green",
              "orange",
              "purple"
            ],
            hoverOffset: 4
          }
        ]
      })
    }
  }

  const populationByAgeChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Population % by Age",
        align: "start",
        font: {
          size: 20
        }
      },
      legend: {
        labels: {
          font: {
            size: 20
          }
        }
      }
    },
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 3
      }
    },
    cutout: 0
  }

  // Population by Income Chart
  const getPopulationByIncome = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_population_by_income`
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
      console.log("There was an error getting the population by income")
    } else if(status === 200) {
      // console.log(data.response.rows[0])
      const populationByIncomeLabels = []
      const populationByIncome = []
      for(const [key, value] of Object.entries(data.response.rows[0])){
        populationByIncomeLabels.push(key)
        populationByIncome.push(parseFloat(value * 100).toFixed(2))
      }
      // console.log('populationByIncomeLabels', populationByIncomeLabels)
      // console.log('populationByIncome', populationByIncome)
      setPopulationByIncomeData({
        labels: populationByIncomeLabels,
        datasets: [
          {
            label: "Population by Income",
            data: populationByIncome,
            backgroundColor: [
              '#e5f6ff',
              '#bae6ff',
              '#82cfff',
              '#33b1ff',
              '#1192e8',
              '#0072c3',
              '#00539a',
              '#003a6d'
            ],
            barThickness: 50
          }
        ]
      })
    }
  }

  const populationByIncomeChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Population % by Income",
        align: "start",
        font: {
          size: 20
        }
      },
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle"
        }
      }
    }
  }

  // General Demographic Data
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

  // Delinquency Rate for Entire Period
  const getTotalLoans = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_total_loans`

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
      // console.log('Total loans', totalLoans.response.rows[0].count)
      setTotalLoans(totalLoans.response.rows[0].count)
    }
  }

  const getDelinquentLoans = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_delinquent_loans`

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
      // console.log('Delinquent loans', delinquentLoans.response.rows[0].count)
      setDelinquentLoans(delinquentLoans.response.rows[0].count)
    }
  }

  // Delinqueny Rate Per Period
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
    const status = response.status
    const data = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      // console.log('Total loans per period', data.response.rows)
      return data.response.rows
      // setTotalLoans(totalLoans.response.rows[0].count)
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
    const status = response.status
    const data = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      // console.log('Delinquent loans per period', data.response.rows)
      return data.response.rows
      // setTotalLoans(totalLoans.response.rows[0].count)
    }
  }

  const getDelinquencyRatePerPeriod = async () => {
    const totalLoans = await getTotalLoansPerPeriod()
    const delinquentLoans = await getDelinquentLoansPerPeriod()

    // console.log('totalLoans', totalLoans)
    // console.log('delinquentLoans', delinquentLoans)

    const delinquencyRateLabels = []
    for(let i = 0; i < totalLoans.length; i++){
      delinquencyRateLabels.push(totalLoans[i].origination_date.split('T')[0])
    }

    const delinquencyRateData = []
    for(let i = 0; i < delinquentLoans.length; i++){
      delinquencyRateData.push(parseFloat((Number(delinquentLoans[i].count) / Number(totalLoans[i].count)) * 100).toFixed(2))
    }

    setDelinquencyRatePerPeriod({
      labels: delinquencyRateLabels,
      datasets: [
        {
          label: "Delinquency Rate",
          data: delinquencyRateData
        }
      ]
    })

    // console.log('delinquencyRateLabels', delinquencyRateLabels)
    // console.log('delinquencyRateData', delinquencyRateData)
  }

  const delinquecyRateChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Delinquency Rate',
        align: 'start',
        font: {
          size: 20
        }
      },
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "blue",
        fill: "start",
        backgroundColor: "lightblue"
      },
      point: {
        radius: 5,
        hitRadius: 5
      }
    }
  }

  // Population by Sex
  const getPopulationBySex = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_population_by_sex`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    const data = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      // console.log('Male population', data.response.rows[0].male_percent)
      setPopulationBySex({
        labels: ["Male", "Female"],
        datasets: [
          {
            label: "Population % by Sex",
            data: [parseFloat(Number(data.response.rows[0].male_percent) * 100).toFixed(2), parseFloat(100 - (Number(data.response.rows[0].male_percent) * 100)).toFixed(2)],
            backgroundColor: [
              "rgba(0,0,255,0.6)",
              "rgba(255,0,0,0.6)"
            ],
            hoverOffset: 4
          }
        ]
      })
    }
  }

  const populationBySexChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Population % by Sex",
        align: "start",
        font: {
          size: 20
        }
      },
      legend: {
        labels: {
          font: {
            size: 20
          }
        }
      }
    },
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 3
      }
    },
    cutout: 0
  }

  // Population by Race
  const getPopulationByRace = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_population_by_race`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    const data = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      // console.log('population by race', data.response.rows[0])
      const populationByRaceLabels = []
      const populationByRaceData = []
      for(const [key, value] of Object.entries(data.response.rows[0])){
        populationByRaceLabels.push(key)
        populationByRaceData.push(parseFloat(value * 100).toFixed(2))
      }
      // console.log('Population by race labels', populationByRaceLabels)
      // console.log('population by race data', populationByRaceData)
      setPopulationByRace({
        labels: populationByRaceLabels,
        datasets: [
          {
            label: "Population % by Race",
            data: populationByRaceData,
            backgroundColor: [
             "red",
             "green",
             "blue",
             "yellow",
             "orange",
             "purple"
            ],
            hoverOffset: 4
          }
        ]
      })
    }
  }

  const populationByRaceChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Population % by Race",
        align: "start",
        font: {
          size: 20
        }
      },
      legend: {
        labels: {
          font: {
            size: 20
          }
        }
      }
    },
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 3
      }
    },
    cutout: 100
  }

  const getData = async () => {
    console.log(queryParams)
    if(!queryParams.msaCode ){
      // TODO: use an alert like the one I built for RedBalloon
      alert("pick an msa")
    }

    // setMsaDemographicData()
    // setUnemploymentRateData()
    // setPopulationByAgeData()
    // setPopulationByIncomeData()

    getUnemploymentRate()
    getDemographicData()
    getTotalLoans()
    getDelinquentLoans()
    getDelinquencyRatePerPeriod()
    getPopulationByAgeData()
    getPopulationByIncome()
    getPopulationBySex()
    getPopulationByRace()
  }

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center pt-20 px-20">
        <form className="flex flex-col md:flex-row" action="#">
          <label className="text-3xl px-4" htmlFor="startDate">Select a start date: </label>
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
          <label className="text-3xl px-4"  htmlFor="endDate">Select an end date: </label>
          <select id="endDate" name="endDate" defaultValue="" onChange={handleChange}>
            <option disabled></option>
            {monthOptions && monthOptions.map(month => {
              return (
                <option key={month.origination_date} value={month.origination_date}>{month.origination_date}</option>
              )
            })}
          </select>
          <label className="text-3xl px-4" htmlFor="msaCode">Select an MSA: </label>
          <select id="msaCode" name="msaCode" defaultValue="" onChange={handleChange}>
            <option disabled></option>
            {msaOptions && msaOptions.map(singleMsa => {
              return (
                <option key={singleMsa.msa} value={singleMsa.msa}>{singleMsa.msa} - {singleMsa.name}</option>
              )
            })}
          </select>
        </form>
        <button className="flex items-center justify-center w-40 h-12 my-8 rounded-md p-4 bg-blue-400 hover:bg-blue-600 text-gray-100" onClick={getData}>See Results</button>
        {msaDemographicData &&
          <h1 className="my-6 text-7xl">Demographic Makeup for {msaDemographicData.name}</h1>
        }
      </div>
      <div>
        <div className="mx-auto px-0 md:px-24">
          <h1 className="my-6 text-5xl">At-A-Glance</h1>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-[23%] border-2 border-blue-400 rounded-md p-4">
              <h1 className="w-full text-xl">
                Total Population
              </h1>
              {msaDemographicData &&
                <span className="text-3xl">{(msaDemographicData.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
              }
            </div>
            <div className="w-full md:w-[23%] border-2 border-blue-400 rounded-md p-4">
              <h1 className="w-full text-xl">
                Median Household Income
              </h1>
              {msaDemographicData &&
                <span className="text-3xl">{(msaDemographicData.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
              }
            </div>
            <div className="w-full md:w-[23%] border-2 border-blue-400 rounded-md p-4">
              <h1 className="w-full text-xl">
                Median Home Value
              </h1>
              {msaDemographicData &&
                <span className="text-3xl">{(msaDemographicData.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
              }
            </div>
            <div className="w-full md:w-[23%] border-2 border-blue-400 rounded-md p-4">
              <h1 className="w-full text-xl">
                Delinquency Rate
              </h1>
              {totalLoans && delinquentLoans &&
                <span className="text-3xl">{parseFloat((delinquentLoans / totalLoans) * 100).toFixed(2)+"%"}</span>
              }
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center">
          {delinquencyRatePerPeriod &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg h-max">
              <Line data={delinquencyRatePerPeriod} width={500} height={250} options={delinquecyRateChartOptions} />
            </div>
          }
          {unemploymentRateData &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg h-max">
              <Line data={unemploymentRateData} width={500} height={250} options={unemploymentChartOptions} />
            </div>
          }
          {populationByAgeData &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg">
              <Doughnut data={populationByAgeData} width={500} height={500} options={populationByAgeChartOptions} />
            </div>
          }
          {populationByIncomeData &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg">
              <Bar data={populationByIncomeData} width={500} height={500} options={populationByIncomeChartOptions} />
            </div>
          }
          {populationBySex &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg">
              <Doughnut data={populationBySex} width={500} height={500} options={populationBySexChartOptions} />
            </div>
          }
          {populationByRace &&
            <div className="m-6 border-4 border-red-400 rounded-md p-6 shadow-lg">
              <Doughnut data={populationByRace} width={500} height={500} options={populationByRaceChartOptions} />
            </div>
          }
        </div>
      </div>
      {/* TODO: pull data that changes over time and show the start/finish points, e.g. start unemployment rate - end unemployment rate */}
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