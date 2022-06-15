import Head from "next/head"
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

import { Bar } from "react-chartjs-2"

import TempLogin from "../src/components/TempLogin"
import TopFeatures from "../src/components/TopFeatures"

export async function getStaticProps() {
  const { Pool } = require('pg')
  const pool = new Pool({
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    password: String(process.env.PGPASSWORD)
  })

  const client = await pool.connect()

  const msaResponse = await client.query(`select msa_code, msa_name from banking_app.msa_names order by msa_code`)
  const monthResponse = await client.query(`select * from banking_app.available_dates order by date`)
  await client.end()
  // client.release()
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

const Home = ({ msaOptions, monthOptions }) => {
  const [isLoggedIn, setLoggedIn] = useState(true)
  const [dateRange, setDateRange] = useState({})
  const [targetRegion, setTargetRegion] = useState()
  const [targetRegionData, setTargetRegionData] = useState()
  const [compRegions, setCompRegions] = useState([])
  const [compRegionsData, setCompRegionsData] = useState()
  const [regionalDelinquencyRates, setRegionalDelinquencyRates] = useState()
  const [nationalDelinquencyRate, setNationalDelinquencyRate] = useState()
  const [populationByAgeData, setPopulationByAgeData] = useState()
  const [populationByAgeOptions, setPopulationByAgeOptions] = useState()
  const [populationByIncomeData, setPopulationByIncomeData] = useState()
  const [populationByIncomeOptions, setPopulationByIncomeOptions] = useState()
  const [showTopFeatures, setShowTopFeatures] = useState(false)

  const handleDateChange = e => {
    e.preventDefault()
    setDateRange({...dateRange, [e.target.name]: e.target.value})
  }

  const handleTargetRegionChange = e => {
    e.preventDefault()
    setTargetRegion({...targetRegion, [e.target.name]: e.target.value})
  }

  const handleCompRegionChange = e => {
    e.preventDefault()
    if(compRegions.length < 2){
      setCompRegions([...compRegions, {compMsaCode: e.target.value, displayText: e.target[e.target.selectedIndex].dataset.display}])
    }
    if(compRegions.length === 2){
      alert('You can select up to two comp regions.')
    }
  }

  const removeCompRegion = e => {
    e.preventDefault()
    const newCompRegions = compRegions.filter(region => region.compMsaCode !== e.target.id)
    setCompRegions(newCompRegions)
  }

  // General Demographic Data
  const getMsaSummaryData = async () => {
    const msaCodes = []
    msaCodes.push(targetRegion.targetMsaCode)
    if(compRegions.length){
      for(const region of compRegions){
        msaCodes.push(region.compMsaCode)
      }
    }

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
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
      setTargetRegionData(data[0])
      if(data.length > 0){
        setCompRegionsData(data.slice(1))
      }
    }
  }

  // Delinquency Rate for Entire Period
  const getRegionalDelinquencyRateForRange = async () => {
    const msaCodes = []
    msaCodes.push(targetRegion.targetMsaCode)
    if(compRegions.length){
      for(const region of compRegions){
        msaCodes.push(region.compMsaCode)
      }
    }

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_regional_delinquency_rate`

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

    data = data.map(row => {
      return {...row, delinquencyRate: ((row.delinquent_msa / row.total_msa) * 100).toFixed(2)}
    })

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setRegionalDelinquencyRates(data)
    }
  }
  const getNationalDelinquencyRateForRange = async () => {
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })

    const endpoint = `/api/get_national_delinquency_rate`

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
      setNationalDelinquencyRate(((data.delinquent_natl / data.total_natl) * 100).toFixed(2))
    }
  }

  // Population by Age Chart
  const getPopulationByAgeData = async () => {
    const JSONdata = JSON.stringify({
      msaCode: targetRegion.targetMsaCode
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
            hoverOffset: 4
          }
        ]
      })

      setPopulationByAgeOptions({
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Population % by Age",
            align: "start",
            font: {
              size: function(context){
                return Math.round(context.chart.width / 20)
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context){
                return `${context.raw}%`
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              font: {
                size: function(context){
                  return Math.round(context.chart.width / 30)
                }
              }
            },
            grid: {
              display: false
            }
          },
          x: {
            ticks: {
              callback: function(value, index, ticks){
                return `${value}%`
              },
              font: {
                size: function(context){
                  return Math.round(context.chart.width / 30)
                }
              }
            }
          }
        }
      })
    }
  }

  // Population by Income Chart
  const getPopulationByIncome = async () => {
    const JSONdata = JSON.stringify({
      msaCode: targetRegion.targetMsaCode
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

      setPopulationByIncomeOptions({
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Population % by Income",
            align: "start",
            font: {
              size: function(context){
                return Math.round(context.chart.width / 20)
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context){
                return `${context.raw}%`
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              font: {
                size: function(context){
                  return Math.round(context.chart.width / 36)
                }
              }
            },
            grid: {
              display: false
            }
          },
          x: {
            ticks: {
              callback: function(value, index, ticks){
                return `${value}%`
              },
              font: {
                size: function(context){
                  return Math.round(context.chart.width / 30)
                }
              }
            }
          }
        }
      })
    }
  }

  const getData = async () => {
      setShowTopFeatures(false)
      await getMsaSummaryData()
      getPopulationByAgeData()
      getPopulationByIncome()
      await getRegionalDelinquencyRateForRange()
      await getNationalDelinquencyRateForRange()
      setShowTopFeatures(true)
  }

  return (
    <>
      <Head>
        <title>Dainamic</title>
      </Head>
      <header className="mx-6">
        <h1 className='p-10 text-7xl text-center lg:text-left'>
          Welcome to D<span className='text-yellow-300'>AI</span>NAMIC
        </h1>
      </header>
      {isLoggedIn ? <main className="h-screen">
        <section className="flex flex-col items-center justify-center px-20">
          <form className="flex flex-col items-center" action="#">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex flex-col md:space-y-4">
                <label className="text-2xl mx-2" htmlFor="startDate">Select a start date: </label>
                <select className="mx-2 w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="startDate" name="startDate" defaultValue="" onChange={handleDateChange}>
                  <option disabled></option>
                  {monthOptions && monthOptions.map(month => {
                    return (
                      <option key={month.date} value={month.date}>{month.date}</option>
                    )
                  })}
                </select>
              </div>
              <div className="flex flex-col md:space-y-4">
                <label className="text-2xl mx-2"  htmlFor="endDate">Select an end date: </label>
                <select className="mx-2 w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="endDate" name="endDate" defaultValue="" onChange={handleDateChange}>
                  <option disabled></option>
                  {monthOptions && monthOptions.map(month => {
                    return (
                      <option key={month.date} value={month.date}>{month.date}</option>
                    )
                  })}
                </select>
              </div>
  {/* Select Target Region */}
              <div className="flex flex-col md:space-y-4">
                <label className="text-2xl mx-2" htmlFor="targetMsaCode">Select a Target Region: </label>
                <select className="mx-2 w-80 md:w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="targetMsaCode" name="targetMsaCode" defaultValue="" onChange={handleTargetRegionChange}>
                  <option disabled></option>
                  {msaOptions && msaOptions.map(singleMsa => {
                    return (
                      <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
                    )
                  })}
                </select>
              </div>
            </div>
{/* Select & display comparison regions */}
            {targetRegion &&
              <div className="w-full mt-4 flex flex-col space-y-2">
                <div>
                  <div className="flex flex-col md:space-y-4 float-right">
                    <label className="text-2xl mx-2" htmlFor="compMsaCode">Select Up to Two Comparison Regions (optional): </label>
                    <select className="mx-2 w-80 md:w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="compMsaCode" name="compMsaCode" defaultValue="" onChange={handleCompRegionChange}>
                      <option disabled></option>
                      {msaOptions && msaOptions.map(singleMsa => {
                        return (
                          <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="w-1/2 float-right">
                    <div className="text-2xl mx-2">Comparison Regions</div>
                    <div className="min-h-[44px] m-2 text-center md:text-left border-2 border-blue-400 p-1 bg-white rounded-md text-xl">
                      {compRegions.length > 0 &&
                        compRegions.map(region => {
                          return (
                            <p key={region.compMsaCode} className="inline-block w-max text-center md:text-left m-1 border-2 border-gray-300 md:px-2 bg-gray-200 text-xl leading-8 space-x-4">
                              <span>{region.displayText}</span>
                              <span className=" h-6 w-6 group hover:cursor-pointer" onClick={removeCompRegion}>
                                <img id={region.compMsaCode} className="h-6 inline align-text-top" src="/close.svg" alt="remove region" />
                              </span>
                            </p>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </form>

          {(!dateRange.startDate || !dateRange.endDate || !targetRegion) &&
            <div className="flex items-center justify-center h-12 my-8 text-2xl">Select a start date, end date, and MSA to see results</div>
          }
          {dateRange.startDate && dateRange.endDate && targetRegion &&
            <button className="flex items-center justify-center w-40 h-12 my-8 rounded-md p-4 bg-blue-400 hover:bg-blue-600 text-gray-100" onClick={getData}>See Results</button>
          }
        </section>
        {targetRegionData &&
          <section className="mb-10">
            <header className="text-center my-10">
              <h1 className="px-10 text-4xl">{targetRegionData.name} {new Date(dateRange.startDate).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})} - {new Date(dateRange.endDate).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})}</h1>
            </header>
            <section className="mx-auto px-0">
              <header className="text-center">
                <h1 className="my-6 px-10 text-4xl">Regional Summary</h1>
              </header>
              <div className="flex justify-center items-center">
                <div>
                  {regionalDelinquencyRates &&
                    <div className="m-4 border-4 border-blue-400 rounded-md p-6 text-center">
                      <h1 className="text-[1.5vw] font-bold py-4">
                        Delinquency Rate
                      </h1>
                      <div>
                        <p className="text-[1.1vw] py-2">
                          {`The delinquency rate for ${targetRegionData.name} is `}
                        </p>
                        <p className="text-[3vw]">
                          {`${regionalDelinquencyRates[0].delinquencyRate}%`}
                        </p>
                        <p className="text-[1.1vw] py-2">
                          This is {regionalDelinquencyRates[0].delinquencyRate > nationalDelinquencyRate ? 'HIGHER' : 'LOWER'} than the national delinquency rate of
                        </p>
                        <p className="text-[3vw]">
                          {`${nationalDelinquencyRate}%`}
                        </p>
                        <p className="text-[1.1vw] py-2">
                          for the same period.
                        </p>
                      </div>
                    </div>
                  }
                </div>
                <div className="flex flex-col w-2/3">
                  <div className="flex flex-col md:flex-row w-full justify-between items-center mt-4">
                    <div className="w-1/3 mx-4 border-2 border-blue-400 rounded-md p-4">
                      <h1 className="w-full text-xl">
                        Total Population
                      </h1>
                      {targetRegionData &&
                        <span className="text-3xl">{(targetRegionData.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                      }
                    </div>
                    <div className="w-1/3 mx-4 border-2 border-blue-400 rounded-md p-4">
                      <h1 className="w-full text-xl">
                        Median Household Income
                      </h1>
                      {targetRegionData &&
                        <span className="text-3xl">{(targetRegionData.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
                      }
                    </div>
                    <div className="w-1/3 mx-4 border-2 border-blue-400 rounded-md p-4">
                      <h1 className="w-full text-xl">
                        Median Home Value
                      </h1>
                      {targetRegionData &&
                        <span className="text-3xl">{(targetRegionData.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
                      }
                    </div>
                  </div>
                  {populationByAgeData  && populationByIncomeData &&
                    <div className="flex">
                      <div className="flex items-center w-1/2 h-fit relative m-4 border-4 border-blue-400 rounded-md p-6 shadow-lg">
                        <Bar data={populationByAgeData} options={populationByAgeOptions} />
                      </div>
                      <div className="flex items-center w-1/2 h-fit relative m-4 border-4 border-blue-400 rounded-md p-6 shadow-lg">
                        <Bar data={populationByIncomeData} options={populationByIncomeOptions} />
                      </div>
                    </div>
                  }
                </div>
              </div>
            </section>
            {/* TODO: set params to a const, separate date params and msa code params, since dates will always be the same */}
            {showTopFeatures &&
              <TopFeatures
                dateRangeParams={{
                  startDate: dateRange.startDate,
                  endDate: dateRange.endDate
                }}
                targetRegionParams={{
                  msaCode: targetRegionData.msa,
                  msaName: targetRegionData.name
                }}
                compRegionsParams={compRegionsData
                  ? compRegionsData.map(region => {
                    return {msa: region.msa, name: region.name}
                  })
                  : []
                }
                regionalDelinquencyRates={regionalDelinquencyRates}
              />
            }
          </section>
        }
      </main>
      : <TempLogin
        setLoggedIn={setLoggedIn}
      />
      }
    </>
  )
}

export default Home