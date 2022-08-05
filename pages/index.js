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

import ChartDataLabels from "chartjs-plugin-datalabels"
import annotationPlugin from "chartjs-plugin-annotation"

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
  Legend,
  ChartDataLabels,
  annotationPlugin
)

ChartJS.defaults.set('plugins.datalabels', {
  display: false
})

import FormInputs from "../src/components/FormInputs"
import Loader from "../src/components/Loader"
import RegionalDelinquencyRatePanel from "../src/components/RegionalDelinquencyRatePanel"
import RegionalPopulationPanel from "../src/components/RegionalPopulationPanel"
import MedianHouseholdIncomePanel from "../src/components/MedianHouseholdIncomePanel"
import MedianHomeValuePanel from "../src/components/MedianHomeValuePanel"
import PopulationByAgePanel from "../src/components/PopulationByAgePanel"
import PopulationByIncomePanel from "../src/components/PopulationByIncomePanel"

import TempLogin from "../src/components/TempLogin"
import TopFeatures from "../src/components/TopFeatures"
import Alert from "../src/components/Alert"

const Home = () => {
  const [isLoading, setLoading] = useState(false)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [msaOptions, setMsaOptions] = useState()
  const [monthOptions, setMonthOptions] = useState()
  const [dateRange, setDateRange] = useState({})
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedRegionsData, setSelectedRegionsData] = useState()
  const [regionalDelinquencyRates, setRegionalDelinquencyRates] = useState()
  const [nationalDelinquencyRate, setNationalDelinquencyRate] = useState()
  const [nationalPopulation, setNationalPopulation] = useState()
  const [nationalMedianHouseholdIncome, setNationalMedianHouseholdIncome] = useState()
  const [nationalMedianHomeValue, setNationalMedianHomeValue] = useState()
  const [populationByAgeData, setPopulationByAgeData] = useState()
  const [populationByIncomeData, setPopulationByIncomeData] = useState()
  const [showTopFeatures, setShowTopFeatures] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  //*******************************************************************//
  //                                                                   //
  //                 SET UP SELECT OPTION INPUTS                       //
  //                                                                   //
  //*******************************************************************//
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

  const handleSelectedRegionsChange = e => {
    e.preventDefault()
    if(selectedRegions.length < 3){
      const updatedCompRegions = ([...selectedRegions, {compMsaCode: e.target.value, displayText: e.target[e.target.selectedIndex].dataset.display}])
      updatedCompRegions.sort((a, b) => a.compMsaCode - b.compMsaCode)
      setSelectedRegions(updatedCompRegions)
    }
    if(selectedRegions.length === 3){
      setShowAlert(true)
      setAlertMessage('You can select up to three regions.')
    }
  }

  const CloseAlert = () => {
    setShowAlert(false)
  }

  const removeRegion = e => {
    e.preventDefault()
    const newCompRegions = selectedRegions.filter(region => region.compMsaCode !== e.target.id)
    setSelectedRegions(newCompRegions)
    setShowAlert(false)
  }

  // General Demographic Data
  const getMsaSummaryData = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.compMsaCode
    })

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
      setSelectedRegionsData(data)
    }
  }

  const getNationalPopulation = async() => {
    const endpoint = `/api/get_national_population`

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
      setNationalPopulation(data)
    }
  }

  const getNationalMedianHouseholdIncome = async() => {
    const endpoint = `/api/get_national_median_household_income`

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
      setNationalMedianHouseholdIncome(data.national_median_household_income)
    }
  }

  const getNationalMedianHomeValue = async() => {
    const endpoint = `/api/get_national_median_home_value`

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
      setNationalMedianHomeValue(data.national_median_home_value)
    }
  }

  // Delinquency Rate for Entire Period
  const getRegionalDelinquencyRateForRange = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.compMsaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_regional_delinquency_rate_for_period`

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
    const msaCodes = selectedRegions.map(region => {
      return region.compMsaCode
    })
    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
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
      setPopulationByAgeData(data)
    }
  }

  // Population by Income Chart
  const getPopulationByIncome = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.compMsaCode
    })
    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
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
      console.log("There was an error getting the population by age")
    } else if(status === 200) {
      setPopulationByIncomeData(data)
    }
  }

  const getData = () => {
    setShowTopFeatures(false)
    getMsaSummaryData()
    getPopulationByAgeData()
    getPopulationByIncome()
    getRegionalDelinquencyRateForRange()
    getNationalDelinquencyRateForRange()
    getNationalPopulation()
    getNationalMedianHouseholdIncome()
    getNationalMedianHomeValue()
    setShowTopFeatures(true)
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div className="max-w-[1600px] mx-auto">
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
              msaOptions={msaOptions}
              handleSelectedRegionsChange={handleSelectedRegionsChange}
              selectedRegions={selectedRegions}
              removeRegion={removeRegion}
              dateRange={dateRange}
              getData={getData}
            />
          : <Loader loadiingText="Building the inputs..." />
        }
        {selectedRegionsData &&
          <section className="mb-10 space-y-4">
            <section className="flex flex-col px-0">
              <header>
                <p className="px-10 text-[1.2vw] italic">{`Selected ${selectedRegionsData.length === 1 ? 'Region' : 'Regions'}:`}</p>
                <div className="mb-6 px-14 text-[1.2vw] italic">
                  {selectedRegionsData.map((region, idx) => {
                    return (
                      <p key={idx}>{region.name}</p>
                    )
                  })}
                </div>
                <h1 className="mb-6 px-10 text-[2vw]">{`Regional ${selectedRegionsData.length === 1 ? 'Summary' : 'Summaries'}`}</h1>
              </header>
              <div>
                {regionalDelinquencyRates
                  ? <RegionalDelinquencyRatePanel
                    selectedRegionsData={selectedRegionsData}
                    regionalDelinquencyRates={regionalDelinquencyRates}
                    nationalDelinquencyRate={nationalDelinquencyRate}
                  />
                  : <Loader loadiingText={"Getting the regional delinquency rate..."}/>
                }
                <MedianHouseholdIncomePanel
                  nationalMedianHouseholdIncome={nationalMedianHouseholdIncome}
                  selectedRegionsData={selectedRegionsData}
                />
                <MedianHomeValuePanel
                  nationalMedianHomeValue={nationalMedianHomeValue}
                  selectedRegionsData={selectedRegionsData}
                />
                <RegionalPopulationPanel
                  nationalPopulation={nationalPopulation}
                  selectedRegionsData={selectedRegionsData}
                />
                {populationByAgeData &&
                  <PopulationByAgePanel
                    populationByAgeData={populationByAgeData}
                    selectedRegionsData={selectedRegionsData}
                  />
                }
                {populationByIncomeData &&
                  <PopulationByIncomePanel
                    populationByIncomeData={populationByIncomeData}
                    selectedRegionsData={selectedRegionsData}
                  />
                }
              </div>
            </section>
            {showTopFeatures &&
              <TopFeatures
                dateRangeParams={dateRange}
                compRegionsParams={selectedRegionsData.map(region => {
                  return {msa: region.msa, name: region.name}
                })}
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
    </div>
  )
}

export default Home