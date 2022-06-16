import Head from "next/head"
import { useEffect, useState } from "react"
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

import FormInputs from "../src/components/FormInputs"
import Loader from "../src/components/Loader"
import RegionalDelinquencyRatePanel from "../src/components/RegionalDelinquencyRatePanel"

import { Bar } from "react-chartjs-2"

import TempLogin from "../src/components/TempLogin"
import TopFeatures from "../src/components/TopFeatures"
import Alert from "../src/components/Alert"

const Home = () => {
  const [isLoading, setLoading] = useState(false)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [msaOptions, setMsaOptions] = useState()
  const [monthOptions, setMonthOptions] = useState()
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
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const getSelectMsaInputOptions = async () => {
    const endpoint = `/api/get_select_msa_input_options`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMsaOptions(data)
    }
  }

  const getSelectDateInputOptions = async () => {
    const endpoint = `/api/get_select_date_input_options`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    const months = data.map(row => {
      const readableDate =  new Date(row.date)
      return readableDate.toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})
    })

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMonthOptions(months)
    }
  }

  useEffect(() => {
    setLoading(true)
    getSelectMsaInputOptions()
    getSelectDateInputOptions()
    setLoading(false)
  },[])

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
      setShowAlert(true)
      setAlertMessage('You can select up to two comp regions.')
    }
  }

  const CloseAlert = () => {
    setShowAlert(false)
  }

  const removeCompRegion = e => {
    e.preventDefault()
    const newCompRegions = compRegions.filter(region => region.compMsaCode !== e.target.id)
    setCompRegions(newCompRegions)
    setShowAlert(false)
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

  if(isLoading) {
    return <Loader/>
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
        {msaOptions && monthOptions
          ? <FormInputs
              handleDateChange={handleDateChange}
              monthOptions={monthOptions}
              handleTargetRegionChange={handleTargetRegionChange}
              targetRegion={targetRegion}
              msaOptions={msaOptions}
              handleCompRegionChange={handleCompRegionChange}
              compRegions={compRegions}
              removeCompRegion={removeCompRegion}
              dateRange={dateRange}
              getData={getData}
            />
          : <Loader loadiingText="Building the inputs..." />
        }
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
                  {regionalDelinquencyRates
                    ? <RegionalDelinquencyRatePanel
                      targetRegionData={targetRegionData}
                      regionalDelinquencyRates={regionalDelinquencyRates}
                      nationalDelinquencyRate={nationalDelinquencyRate}
                    />
                    : <Loader loadiingText={"Getting the regional delinquency rate..."}/>
                  }
                </div>
                <div className="flex flex-col w-2/3">
                  <div className="flex flex-col items-stretch md:flex-row w-full justify-between mt-4 h-auto">
                    <div className="w-1/3 flex flex-col justify-center mx-4 border-2 border-blue-400 rounded-md p-4 text-center">
                      <h1 className="w-full text-xl font-semibold">
                        Total Population
                      </h1>
                      {targetRegionData
                        ? <p className="text-3xl">{(targetRegionData.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                        : <Loader loadiingText={"Getting population data..."}/>
                      }
                    </div>
                    <div className="w-1/3 flex flex-col justify-center mx-4 border-2 border-blue-400 rounded-md p-4 text-center">
                      <h1 className="w-full text-xl font-semibold">
                        Median Household Income
                      </h1>
                      {targetRegionData
                        ? <p className="text-3xl">{(targetRegionData.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</p>
                        : <Loader loadiingText={"Getting median home income..."}/>
                      }
                    </div>
                    <div className="w-1/3 flex flex-col justify-center mx-4 border-2 border-blue-400 rounded-md p-4 text-center">
                      <h1 className="w-full text-xl font-semibold">
                        Median Home Value
                      </h1>
                      {targetRegionData
                        ? <p className="text-3xl">{(targetRegionData.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</p>
                        : <Loader loadiingText={"Getting median home value"}/>
                      }
                    </div>
                  </div>
                  {populationByAgeData  && populationByIncomeData
                    ? <div className="flex">
                        <div className="flex items-center w-1/2 h-fit relative m-4 border-4 border-blue-400 rounded-md p-6 shadow-lg">
                          <Bar data={populationByAgeData} options={populationByAgeOptions} />
                        </div>
                        <div className="flex items-center w-1/2 h-fit relative m-4 border-4 border-blue-400 rounded-md p-6 shadow-lg">
                          <Bar data={populationByIncomeData} options={populationByIncomeOptions} />
                        </div>
                      </div>
                    : <Loader loadiingText={"Getting age and income data..."}/>
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
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
      />
      }
      {showAlert &&
          <Alert
            message={alertMessage}
            closeAlert={CloseAlert}
          />
        }
    </>
  )
}

export default Home