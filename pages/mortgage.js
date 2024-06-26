// import Head from "next/head"
import { useEffect, useState, memo } from "react"

import MortgageFormInputs from "../src/components/MortgageFormInputs"
import Loader from "../src/components/Loader"
import RegionalDelinquencyRatePanel from "../src/components/RegionalDelinquencyRatePanel"
import RegionalPopulationPanel from "../src/components/RegionalPopulationPanel"
import MedianHouseholdIncomePanel from "../src/components/MedianHouseholdIncomePanel"
import MedianHomeValuePanel from "../src/components/MedianHomeValuePanel"
import PopulationByAgePanel from "../src/components/PopulationByAgePanel"
import PopulationByIncomePanel from "../src/components/PopulationByIncomePanel"

import DelinquencyByCreditScore from "../src/components/DelinquencyByCreditScore"
import DelinquencyByCreditScoreByPeriod from "../src/components/DelinquencyByCreditScoreByPeriod"
import DelinquencyByDTI from "../src/components/DelinquencyByDTI"
import DelinquencyByEducation from "../src/components/DelinquencyByEducation"
import DelinquencyByFTBStatus from "../src/components/DelinquencyByFTBStatus"
import DelinquencyByIndustry from "../src/components/DelinquencyByIndustry"
import DelinquencyByInterestRate from "../src/components/DelinquencyByInterestRate"
import DelinquencyByHighBalance from "../src/components/DelinquencyByHighBalance"
import DelinquencyByOriginalBalance from "../src/components/DelinquencyByOriginalBalance"
import DelinquencyByLoanTerm from "../src/components/DelinquencyByLoanTerm"
import DelinquencyByLTV from "../src/components/DelinquencyByLTV"
import DelinquencyByMaritalStatus from "../src/components/DelinquencyByMaritalStatus"
import DelinquencyByNumberOfBorrowers from "../src/components/DelinquencyByNumberOfBorrowers"
import DelinquencyByRace from "../src/components/DelinquencyByRace"
import DelinquencyByUnemploymentRate from "../src/components/DelinquencyByUnemploymentRate"
import TopFeatures from "../src/components/TopFeatures"

const Mortgage = () => {
  const [isLoading, setLoading] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState("inline")
  const [showChangeOptionsButton, setShowChangeOptionsButton] = useState("hidden")
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
  const [topFeatures, setTopFeatures] = useState()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  // STATE FOR CHARTS
  const [featuredCharts, setFeaturedCharts] = useState()
  const [delinquencyByCreditScoreByPeriod, setDelinquencyByCreditScoreByPeriod] = useState()
  const [delinquencyByCreditScore, setDelinquencyByCreditScore] = useState()
  const [delinquencyByDTI, setDelinquencyByDTI] = useState()
  const [delinquencyByEducation, setDelinquencyByEducation] = useState()
  const [delinquencyByFTBS, setDelinquencyByFTBS] = useState()
  const [delinquencyByHighBalance, setDelinquencyByHighBalance] = useState()
  const [delinquencyByIndustry, setDelinquencyByIndustry] = useState()
  const [delinquencyByInterestRate, setDelinquencyByInterestRate] = useState()
  const [delinquencyByOriginalBalance, setDelinquencyByOriginalBalance] = useState()
  const [delinquencyByLoanTerm, setDelinquencyByLoanTerm] = useState()
  const [delinquencyByLTV, setDelinquencyByLTV] = useState()
  const [delinquencyByMaritalStatus, setDelinquencyByMaritalStatus] = useState()
  const [delinquencyByRace, setDelinquencyByRace] = useState()
  const [delinquencyByNumberOfBorrowers, setDelinquencyByNumberOfBorrowers] = useState()
  const [unemploymentRateData, setUnemploymentRateData] = useState()
  const [delinquencyRateData, setDelinquencyRateData] = useState()

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
      return readableDate.toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"})
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
      const updatedRegions = ([...selectedRegions, {msaCode: e.target.value, displayText: e.target[e.target.selectedIndex].dataset.display}])
      updatedRegions.sort((a, b) => a.msaCode - b.msaCode)
      setSelectedRegions(updatedRegions)
    }
    if(selectedRegions.length === 3){
      setShowAlert(true)
      setAlertMessage('You can select up to three regions.')
    }
  }

  const closeAlert = () => {
    setShowAlert(false)
  }

  const removeRegion = e => {
    e.preventDefault()
    const newCompRegions = selectedRegions.filter(region => region.msaCode !== e.target.id)
    setSelectedRegions(newCompRegions)
    setShowAlert(false)
  }

  // General Demographic Data
  const getMsaSummaryData = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
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
      console.log("There was an error getting the region summary data")
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
      console.log("There was an error getting national population data")
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
      console.log("There was an error getting national median household income data")
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
      console.log("There was an error getting national median home value data")
    } else if(status === 200){
      setNationalMedianHomeValue(data.national_median_home_value)
    }
  }

  // Delinquency Rate for Entire Period
  const getRegionalDelinquencyRateForRange = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
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
      console.log("There was an error getting the regional delinquency rate")
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
      console.log("There was an error getting the national delinquency rate")
    } else if(status === 200){
      setNationalDelinquencyRate(((data.delinquent_natl / data.total_natl) * 100).toFixed(2))
    }
  }

  // Population by Age Chart
  const getPopulationByAgeData = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
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
      return region.msaCode
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
      console.log("There was an error getting the population by income data")
    } else if(status === 200) {
      setPopulationByIncomeData(data)
    }
  }

  const getRegionalTopFeatures = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })
    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_top_features`
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
      console.log("There was an error getting the top features data")
    } else if(status === 200) {
      data.forEach(row => {
        const uniqueFeatures = Object.keys(row)
          .filter((key) => key.includes("feat"))
          .reduce((obj, key) => {
              return Object.assign(obj, {
                [key]: row[key]
              });
        }, {});

        row.featureList = [...new Set(Object.values(uniqueFeatures))].slice(0,5)
      })

      let featuresForCharts = data.map(row => {
        return row.featureList
      })
      featuresForCharts = [...new Set([].concat.apply([], featuresForCharts))]
      setTopFeatures(data)
      setFeaturedCharts(featuresForCharts)
    }
  }

  const getDeliquencyByCreditScoreByPeriod = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_credit_score_per_period`
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
      console.log("There was an error getting the credit score data")
    } else if(status === 200) {
      setDelinquencyByCreditScoreByPeriod(data)
    }
  }

  const getDelinquencyByCreditScore = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_credit_score`
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
      console.log("There was an error getting the credit score data")
    } else if(status === 200) {
      setDelinquencyByCreditScore(data)
    }
  }

  const getDelinquencyByDTI = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_dti`
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
      console.log("There was an error getting the DTI data")
    } else if(status === 200) {
      setDelinquencyByDTI(data)
    }
  }

  const getDelinquencyRateByEducation = async () => {
    const endpoint = `api/get_population_by_education`
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

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
      console.log("There was an error getting the education data")
    } else if(status === 200){
      setDelinquencyByEducation(data)
    }
  }

  const getDelinquencyRateByFTBS = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_ftbs`
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
      console.log("There was an error getting the FTBS data")
    } else if(status === 200){
      setDelinquencyByFTBS(data)
    }
  }

  const getDelinquencyRateByHighBalance = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_high_balance`
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
      console.log("There was an error getting the high balance data")
    } else if(status === 200){
      setDelinquencyByHighBalance(data)
    }
  }

  const getDelinquencyByIndustry = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const endpoint = `api/get_delinquency_by_industry`
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the industry data")
    } else if(status === 200){
      setDelinquencyByIndustry(data)
    }
  }

  const getDelinquencyRateByInterestRate = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_interest_rate`
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
      console.log("There was an error getting the interest rate data")
    } else if(status === 200){
      setDelinquencyByInterestRate(data)
    }
  }

  const getDelinquencyByOriginalBalance = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_original_balance`
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
      console.log("There was an error getting the original balance data")
    } else if(status === 200){
      setDelinquencyByOriginalBalance(data)
    }
  }

  const getDelinquencyByLoanTerm = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })
    const endpoint = `/api/get_delinquency_by_loan_term`
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
      console.log("There was an error getting the loan term data")
    } else if(status === 200){
      setDelinquencyByLoanTerm(data)
    }
  }

  const getDelinquencyByLTV = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })
    const endpoint = `/api/get_delinquency_by_ltv`
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
      console.log("There was an error getting the LTV data")
    } else if(status === 200){
      setDelinquencyByLTV(data)
    }
  }

  const getDelinquencyByMaritalStatus = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    // Get regional delinquency rates
    const endpoint = `api/get_delinquency_by_marital_status`
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the marital status data")
    } else if(status === 200){
      setDelinquencyByMaritalStatus(data)
    }
  }

  const getDelinquencyByRace = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    // Get regional delinquency rates
    const endpoint = `api/get_delinquency_by_race`
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the race data")
    } else if(status === 200){
      setDelinquencyByRace(data)
    }
  }

  const getDelinquencyByNumberOfBorrowers = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_num_borrowers`
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
      console.log("There was an error getting the number of borrowers data")
    } else if(status === 200){
      setDelinquencyByNumberOfBorrowers(data)
    }
  }

  const getUnemploymentRateData = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const endpoint = `/api/get_unemployment_rate`
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the unemployment data")
    } else if(status === 200){
      setUnemploymentRateData(data)
    }
  }

  const getDelinquencyRateData = async () => {
    const msaCodes = selectedRegions.map(region => {
      return region.msaCode
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const endpoint = `/api/get_delinquency_data_per_period`
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the delinquency rate data")
    } else if(status === 200){
      setDelinquencyRateData(data)
  }
}

  const getData = () => {
    setShowOptionsModal("hidden")
    setShowChangeOptionsButton("flex")
    getMsaSummaryData()
    getPopulationByAgeData()
    getPopulationByIncome()
    getRegionalDelinquencyRateForRange()
    getNationalDelinquencyRateForRange()
    getNationalPopulation()
    getNationalMedianHouseholdIncome()
    getNationalMedianHomeValue()
    getRegionalTopFeatures()

    getDeliquencyByCreditScoreByPeriod()
    getDelinquencyByCreditScore()
    getDelinquencyByDTI()
    getDelinquencyRateByEducation()
    getDelinquencyRateByFTBS()
    getDelinquencyRateByHighBalance()
    getDelinquencyByIndustry()
    getDelinquencyRateByInterestRate()
    getDelinquencyByOriginalBalance()
    getDelinquencyByLoanTerm()
    getDelinquencyByLTV()
    getDelinquencyByMaritalStatus()
    getDelinquencyByNumberOfBorrowers()
    getDelinquencyByRace()
    getDelinquencyRateData()
    getUnemploymentRateData()
  }

  const toggleShowOptionsModal = () => {
    setShowChangeOptionsButton("hidden")
    setShowOptionsModal("inline")
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <header className="mx-6">
        <h1 className='py-10 px-4 text-[3.5vw] 3xl:text-6xl text-left'>
          Welcome to D<span className='text-yellow-300'>AI</span>NAMIC
        </h1>
      </header>
      <main className="h-screen">
        {msaOptions && monthOptions
          ? <MortgageFormInputs
              handleDateChange={handleDateChange}
              monthOptions={monthOptions}
              msaOptions={msaOptions}
              handleSelectedRegionsChange={handleSelectedRegionsChange}
              selectedRegions={selectedRegions}
              removeRegion={removeRegion}
              dateRange={dateRange}
              getData={getData}
              showChangeOptionsButton={showChangeOptionsButton}
              toggleShowOptionsModal={toggleShowOptionsModal}
              showOptionsModal={showOptionsModal}
              showAlert={showAlert}
              alertMessage={alertMessage}
              closeAlert={closeAlert}
            />
          : <Loader loadiingText="Building the inputs..." />
        }
        {selectedRegionsData &&
          <section className="mb-10 space-y-4">
            <section className="flex flex-col px-0">
              <header className={`${showChangeOptionsButton} my-6 3xl:my-8`}>
                <div>
                  <p className="px-10 text-[1.6vw] 3xl:text-3xl italic">{`Selected ${selectedRegionsData.length === 1 ? 'Region' : 'Regions'}:`}</p>
                  <div className="mb-6 px-14 text-[1.2vw] italic">
                    {selectedRegionsData.map((region, idx) => {
                      return (
                        <p key={idx}>{region.name}</p>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <p className="px-10 text-[1.6vw] 3xl:text-3xl italic">Selected Dates</p>
                  <div className="mb-6 px-14 text-[1.2vw] italic">
                    <p><span>{dateRange.startDate}</span> - <span>{dateRange.endDate}</span></p>
                  </div>
                </div>
              </header>
                <h1 className="mb-6 px-10 text-[1.8vw]">{`Regional ${selectedRegionsData.length === 1 ? 'Summary' : 'Summaries'}`}</h1>
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
            {topFeatures &&
              <TopFeatures
                topFeatures={topFeatures}
              />
            }
            <div className="space-y-6">
              {featuredCharts && featuredCharts.map((feature, i) => {
                switch(feature) {
                  case "Credit Score":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4 divide-y-2">
                        {delinquencyByCreditScoreByPeriod ?
                          <div>
                            <DelinquencyByCreditScoreByPeriod
                              data={delinquencyByCreditScoreByPeriod}
                            />
                          </div>
                          : <Loader loadiingText={"Getting credit score by month data..."}/>
                        }
                        {delinquencyByCreditScore ?
                          <div>
                            <DelinquencyByCreditScore
                              data={delinquencyByCreditScore}
                            />
                          </div>
                          : <Loader loadiingText={"Getting credit score by region data..."}/>
                        }
                      </div>
                    );
                  case "Debt-to-Income":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByDTI ?
                          <DelinquencyByDTI
                            data={delinquencyByDTI}
                          />
                          : <Loader loadiingText={"Getting debt-to-income data..."}/>
                        }
                      </div>
                    );
                  case "Education":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {(delinquencyByEducation) ?
                          <DelinquencyByEducation
                            data={delinquencyByEducation}
                          />
                          : <Loader loadiingText={"Getting education level data..."}/>
                        }
                      </div>
                    );
                  case "First Time Buyer Status":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByFTBS ?
                          <DelinquencyByFTBStatus
                            data={delinquencyByFTBS}
                          />
                          : <Loader loadiingText={"Getting first time buyer data..."}/>
                        }
                      </div>
                    );
                  case "High Balance":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByHighBalance ?
                          <DelinquencyByHighBalance
                            data={delinquencyByHighBalance}
                          />
                          : <Loader loadiingText={"Getting high balance indicator data..."}/>
                        }
                      </div>
                    );
                  case "Industry":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByIndustry ?
                          <DelinquencyByIndustry
                            data={delinquencyByIndustry}
                          />
                          : <Loader loadiingText={"Getting industry data..."}/>
                        }
                      </div>
                    );
                  case "Interest Rate":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByInterestRate ?
                          <DelinquencyByInterestRate
                            data={delinquencyByInterestRate}
                          />
                          : <Loader loadiingText={"Getting interest rate data..."}/>
                        }
                      </div>
                    );
                  case "Loan Balance":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByOriginalBalance ?
                          <DelinquencyByOriginalBalance
                            data={delinquencyByOriginalBalance}
                          />
                          : <Loader loadiingText={"Getting original loan balance data..."}/>
                        }
                      </div>
                    );
                  case "Loan Term":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByLoanTerm ?
                          <DelinquencyByLoanTerm
                            data={delinquencyByLoanTerm}
                          />
                          : <Loader loadiingText={"Getting loan term data..."}/>
                        }
                      </div>
                    );
                  case "Loan-to-Value":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByLTV ?
                          <DelinquencyByLTV
                            data={delinquencyByLTV}
                          />
                          : <Loader loadiingText={"Getting loan-to-value data..."}/>
                        }
                      </div>
                    );
                  case "Marital Status":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByMaritalStatus ?
                          <DelinquencyByMaritalStatus
                            data={delinquencyByMaritalStatus}
                          />
                          : <Loader loadiingText={"Getting marital status data..."}/>
                        }
                      </div>
                    );
                  case "Number of Borrowers":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {delinquencyByNumberOfBorrowers ?
                          <DelinquencyByNumberOfBorrowers
                            data={delinquencyByNumberOfBorrowers}
                          />
                          : <Loader loadiingText={"Getting number of borrowers data..."}/>
                        }
                      </div>
                    );
                  case "Race":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                      {delinquencyByRace ?
                          <DelinquencyByRace
                            data={delinquencyByRace}
                          />
                          : <Loader loadiingText={"Getting race data..."}/>
                        }
                      </div>
                    );
                  case "Unemployment Rate":
                    return (
                      <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                        {(unemploymentRateData && delinquencyRateData) ?
                          <DelinquencyByUnemploymentRate
                            dateRange={dateRange}
                            unemploymentRateData={unemploymentRateData}
                            delinquencyRateData={delinquencyRateData}
                          />
                          : <Loader loadiingText={"Getting unemployment data..."}/>
                        }
                      </div>
                    );
                }
              })}
            </div>
          </section>
        }
      </main>
    </div>
  )
}

export default memo(Mortgage)