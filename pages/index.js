import Head from "next/head"
import { useState, createContext, useContext } from "react"
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

import TopFeatures from "../src/components/TopFeatures"

const DelinquencyRateByDemographic = ({ msaOptions, monthOptions }) => {
  const [queryParams, setQueryParams] = useState({})
  const [msaSummaryData, setMsaSummaryData] = useState()
  const [delinquencyRateForRange, setDelinquencyRateForRange] = useState()
  const [delinquencyRatePerPeriod, setDelinquencyRatePerPeriod] = useState()
  const [unemploymentRateData, setUnemploymentRateData] = useState()
  const [populationByAgeData, setPopulationByAgeData] = useState()
  const [populationByIncomeData, setPopulationByIncomeData] = useState()
  const [populationBySex, setPopulationBySex] = useState()
  const [populationByRace, setPopulationByRace] = useState()
  const [showTopFeatures, setShowTopFeatures] = useState(false)

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
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the unemployment rate")
    } else if(status === 200){
      const unemploymentRateLabels = []
      data.map(row => {
        unemploymentRateLabels.push(row.origination_date.split('T')[0])
      })

      const unemploymentRates = []
      data.map(row => {
        unemploymentRates.push(row.unemployment_rate)
      })

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
        borderColor: '#1192e8',
        fill: "start",
        backgroundColor: '#bae6ff',
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
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the population by age")
    } else if(status === 200) {
      const populationByAgeLabels = []
      const populationByAge = []
      for(const [key, value] of Object.entries(data)){
        populationByAgeLabels.push(key)
        populationByAge.push(parseFloat(value * 100).toFixed(2))
      }

      setPopulationByAgeData({
        labels: populationByAgeLabels,
        datasets: [
          {
            label: "Population by Age",
            data: populationByAge,
            backgroundColor: [
              '#33b1ff',
              '#1192e8',
              '#0072c3',
              '#00539a',
              '#003a6d'
            ],
            borderColor: [
              '#33b1ff',
              '#1192e8',
              '#0072c3',
              '#00539a',
              '#003a6d'
            ],
            // barThickness: 50,
            hoverOffset: 4
          }
        ]
      })
    }
  }

  const populationByAgeChartOptions = {
    indexAxis: 'y',
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
        position: "top",
        align: "start",
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle"
        },
        font: 16
      }
    },
    elements: {
      bar: {
        borderWidth: 1
      }
    }
  }

  // Population by Income Chart
  const getPopulationByIncome = async () => {
    const JSONdata = JSON.stringify({
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
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the population by income")
    } else if(status === 200) {
      const populationByIncomeLabels = []
      const populationByIncome = []
      for(const [key, value] of Object.entries(data)){
        populationByIncomeLabels.push(key)
        populationByIncome.push(parseFloat(value * 100).toFixed(2))
      }

      setPopulationByIncomeData({
        maintainAspectRation: false,
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
            ]
          }
        ]
      })
    }
  }

  const populationByIncomeChartOptions = {
    responsive: true,
    indexAxis: 'y',
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
  const getMsaSummaryData = async () => {
    const JSONdata = JSON.stringify({
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_msa_summary_data`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMsaSummaryData(data)
    }
  }

  // Delinquency Rate for Entire Period
  const getDelinquencyRateForRange = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_delinquency_data_for_date_range`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setDelinquencyRateForRange(((data.delinquent_loans / data.all_loans) * 100).toFixed(2))
    }
  }

  // Delinqueny Rate Per Period
  const getDelinquencyRatePerPeriod = async () => {
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/get_delinquency_data_per_period`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      const delinquencyRateLabels = []
      for(let i = 0; i < data.length; i++){
        delinquencyRateLabels.push(data[i].origination_date.split('T')[0])
      }

      const delinquencyRateData = []
      for(let i = 0; i < data.length; i++){
        delinquencyRateData.push(parseFloat((Number(data[i].delinquent_loans) / Number(data[i].total_loans)) * 100).toFixed(2))
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
    }
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
        borderColor: "#1192e8",
        fill: "start",
        backgroundColor: "#bae6ff"
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
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setPopulationBySex({
        labels: ["Male", "Female"],
        datasets: [
          {
            label: "Population % by Sex",
            data: [parseFloat(Number(data) * 100).toFixed(2), parseFloat(100 - (Number(data) * 100)).toFixed(2)],
            backgroundColor: [
              '#bae6ff',
              '#0072c3'
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
        position: "bottom",
        align: "middle",
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle"
        }
      }
    },
    cutout: 0
  }

  // Population by Race
  const getPopulationByRace = async () => {
    const JSONdata = JSON.stringify({
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
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      const populationByRaceLabels = []
      const populationByRaceData = []
      for(const [key, value] of Object.entries(data)){
        populationByRaceLabels.push(key)
        populationByRaceData.push(parseFloat(value * 100).toFixed(2))
      }

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
            hoverOffset: 25
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
        position: "bottom",
        align: "middle",
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle"
        }
      }
    },
    cutout: 25,
    hoverOffset: 25
  }

  const getData = () => {
    if(!queryParams.msaCode ){
      // TODO: use an alert like the one I built for RedBalloon
      alert("pick an msa")
    }

    // setMsaSummaryData()
    // setUnemploymentRateData()
    // setPopulationByAgeData()
    // setPopulationByIncomeData()

    getUnemploymentRate()
    getMsaSummaryData()
    getDelinquencyRateForRange()
    getDelinquencyRatePerPeriod()
    getPopulationByAgeData()
    getPopulationByIncome()
    getPopulationBySex()
    getPopulationByRace()
    setShowTopFeatures(true)
  }

  return (
    <>
      <Head>
        <title>Dainamic</title>
      </Head>
      <div className="h-screen">
        <h1 className='p-10 text-7xl'>
          Welcome to D<span className='text-yellow-300'>AI</span>NAMIC
        </h1>
        <div className="flex flex-col items-center px-20">
          <form className="flex flex-col 2xl:flex-row" action="#">
            <label className="text-2xl 2xl:px-4" htmlFor="startDate">Select a start date: </label>
            {/* TODO: show an alert if date is outside range */}
            <select className="pl-6 border-2 border-blue-400 bg-white rounded-md text-xl" id="startDate" name="startDate" defaultValue="" onChange={handleChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month.date} value={month.date}>{month.date}</option>
                )
              })}
            </select>
            <label className="text-2xl 2xl:px-4"  htmlFor="endDate">Select an end date: </label>
            <select className="pl-6 border-2 border-blue-400 bg-white rounded-md text-xl" id="endDate" name="endDate" defaultValue="" onChange={handleChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month.date} value={month.date}>{month.date}</option>
                )
              })}
            </select>
            <label className="text-2xl 2xl:px-4" htmlFor="msaCode">Select an MSA: </label>
            <select className="w-96 pl-6 border-2 border-blue-400 bg-white rounded-md text-xl" id="msaCode" name="msaCode" defaultValue="" onChange={handleChange}>
              <option disabled></option>
              {msaOptions && msaOptions.map(singleMsa => {
                return (
                  <option key={singleMsa.msa_code} value={singleMsa.msa_code}>{singleMsa.msa_code} - {singleMsa.msa_name}</option>
                )
              })}
            </select>
          </form>
          <button className="flex items-center justify-center w-40 h-12 my-8 rounded-md p-4 bg-blue-400 hover:bg-blue-600 text-gray-100" onClick={getData}>See Results</button>
          {msaSummaryData &&
          <>
            <h1 className="my-6 text-5xl">{msaSummaryData.name} {new Date(queryParams.startDate).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})} - {new Date(queryParams.endDate).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})}</h1>
          </>
          }
        </div>
        <div>
          <div className="mx-auto px-0">
            <h1 className="my-6 px-16 text-4xl">Regional Summary</h1>
            <div className="flex flex-col md:flex-row w-full justify-center items-center space-x-2">
              <div className="w-full md:w-[22.5%] border-2 border-blue-400 rounded-md p-4">
                <h1 className="w-full text-xl">
                  Total Population
                </h1>
                {msaSummaryData &&
                  <span className="text-3xl">{(msaSummaryData.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                }
              </div>
              <div className="w-full md:w-[22.5%] border-2 border-blue-400 rounded-md p-4">
                <h1 className="w-full text-xl">
                  Median Household Income
                </h1>
                {msaSummaryData &&
                  <span className="text-3xl">{(msaSummaryData.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
                }
              </div>
              <div className="w-full md:w-[22.5%] border-2 border-blue-400 rounded-md p-4">
                <h1 className="w-full text-xl">
                  Median Home Value
                </h1>
                {msaSummaryData &&
                  <span className="text-3xl">{(msaSummaryData.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
                }
              </div>
              <div className="w-full md:w-[22.5%] border-2 border-blue-400 rounded-md p-4">
                <h1 className="w-full text-xl">
                  Delinquency Rate
                </h1>
                {delinquencyRateForRange &&
                  <span className="text-3xl">{delinquencyRateForRange+"%"}</span>
                }
              </div>
            </div>
          </div>
          <div>
            <div className="flex w-full justify-center items-center">
              {populationByAgeData &&
                <div className="flex items-center w-4/12 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Bar data={populationByAgeData} options={populationByAgeChartOptions} />
                </div>
              }
              {populationByIncomeData &&
                <div className="flex items-center w-4/12 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Bar data={populationByIncomeData} options={populationByIncomeChartOptions} />
                </div>
              }
              {populationBySex &&
                <div className="flex items-center w-1/5 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Doughnut data={populationBySex} options={populationBySexChartOptions} />
                </div>
              }
            </div>
          </div>
          <div>
            <div className="flex w-full justify-center items-center">
              {populationByRace &&
                <div className="flex items-center w-1/5 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Doughnut data={populationByRace} options={populationByRaceChartOptions} />
                </div>
              }
              {delinquencyRatePerPeriod &&
                <div className="flex items-center w-4/12 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Line data={delinquencyRatePerPeriod} options={delinquecyRateChartOptions} />
                </div>
              }
              {unemploymentRateData &&
                <div className="flex items-center w-4/12 h-fit relative m-4 border-4 border-slate-300 rounded-md p-6 shadow-lg">
                  <Line data={unemploymentRateData} options={unemploymentChartOptions} />
                </div>
              }
            </div>
          </div>
          {showTopFeatures &&
              <TopFeatures
                params={queryParams}
              />
          }
        </div>
        {/* TODO: pull data that changes over time and show the start/finish points, e.g. start unemployment rate - end unemployment rate */}
      </div>
    </>
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

  const msaResponse = await pool.query(`select msa_code, msa_name from banking_app.msa_names order by msa_code`)
  const monthResponse = await pool.query(`select * from banking_app.available_dates order by date`)
  for(const month of monthResponse.rows){
    month.date = month.date.toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})
  }

  return {
    props: {
      msaOptions: msaResponse.rows,
      monthOptions: monthResponse.rows,
    },
  }
}