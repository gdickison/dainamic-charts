import { useEffect, useState } from "react"

import CexFormInputs from "../src/components/CexFormInputs"
import Loader from "../src/components/Loader"
import CexSampleSize from "../src/components/CexSampleSize"
import CexSampleAge from "../src/components/CexSampleAge"
import CexSampleSex from "../src/components/CexSampleSex"
import CexSampleMaritalStatus from "../src/components/CexSampleMaritalStatus"
import CexSampleEducation from "../src/components/CexSampleEducation"
import CexSampleRace from "../src/components/CexSampleRace"
import CexSampleEarners from "../src/components/CexSampleEarners"

const cex = () => {
  const [isLoading, setLoading] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState("inline")
  const [showChangeOptionsButton, setShowChangeOptionsButton] = useState("hidden")
  const [regionOptions, setRegionOptions] = useState()
  const [monthOptions, setMonthOptions] = useState()
  const [dateRange, setDateRange] = useState({})
  const [selectedRegions, setSelectedRegions] = useState([])

  const [sampleSizeData, setSampleSizeData] = useState()
  const [sampleAgeData, setSampleAgeData] = useState()
  const [sampleSexData, setSampleSexData] = useState()
  const [sampleMaritalStatusData, setSampleMaritalStatusData] = useState()
  const [sampleEducationData, setSampleEducationData] = useState()
  const [sampleRaceData, setSampleRaceData] = useState()
  const [sampleEarnersData, setSampleEarnersData] = useState()

  //*******************************************************************//
  //                                                                   //
  //                 SET UP SELECT OPTION INPUTS                       //
  //                                                                   //
  //*******************************************************************//
  const getRegionOptions = async () => {
    const endpoint = `/api/cex_available_regions`

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
      setRegionOptions(data)
    }
  }

  const getMonthOptions = async () => {
    const endpoint = `/api/cex_available_months`

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
    data.forEach(row => {
      const readableDate =  new Date(row.date)
      row.displayDate = readableDate.toLocaleDateString('en-us', {year: "numeric", month: "long", timeZone: "UTC"})
    })

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMonthOptions(data)
    }
  }

  useEffect(() => {
    setLoading(true)
    getRegionOptions()
    getMonthOptions()
    setLoading(false)
  },[])

  const handleDateChange = e => {
    e.preventDefault()
    setDateRange({...dateRange, [e.target.name]: e.target.value})
  }

  const handleSelectedRegionsChange = e => {
    e.preventDefault()
      const updatedRegions = ([...selectedRegions, {regionCode: e.target.value, displayText: e.target[e.target.selectedIndex].dataset.display}])
      updatedRegions.sort((a, b) => a.regionCode - b.regionCode)
      setSelectedRegions(updatedRegions)

  }

  const removeRegion = e => {
    e.preventDefault()
    const newCompRegions = selectedRegions.filter(region => region.regionCode !== e.target.id)
    setSelectedRegions(newCompRegions)
  }

  //*******************************************************************//
  //                                                                   //
  //                            PULL DATA                              //
  //                                                                   //
  //*******************************************************************//

  const getSampleSize = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_size`

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

    if(status !== 200){
      console.log("There was an error getting the sample size data")
    } else if(status === 200){
      setSampleSizeData(data)
    }
  }

  const getSampleAge = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_age`

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

    if(status !== 200){
      console.log("There was an error getting the sample age data")
    } else if(status === 200){
      setSampleAgeData(data)
    }
  }

  const getSampleSex = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_sex`

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

    if(status !== 200){
      console.log("There was an error getting the sample sex data")
    } else if(status === 200){
      setSampleSexData(data)
    }
  }

  const getSampleMaritalStatus = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_marital_status`

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

    if(status !== 200){
      console.log("There was an error getting the sample marital status data")
    } else if(status === 200){
      setSampleMaritalStatusData(data)
    }
  }

  const getSampleEducation = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_education`

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

    if(status !== 200){
      console.log("There was an error getting the sample education data")
    } else if(status === 200){
      setSampleEducationData(data)
    }
  }

  const getSampleRace = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_race`

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

    if(status !== 200){
      console.log("There was an error getting the sample race data")
    } else if(status === 200){
      setSampleRaceData(data)
    }
  }

  const getSampleEarners = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sample_earners`

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

    if(status !== 200){
      console.log("There was an error getting the sample earners data")
    } else if(status === 200){
      setSampleEarnersData(data)
    }
  }

  const getData = () => {
    setShowOptionsModal("hidden")
    setShowChangeOptionsButton("flex")
    getSampleSize()
    getSampleAge()
    getSampleSex()
    getSampleMaritalStatus()
    getSampleEducation()
    getSampleRace()
    getSampleEarners()
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
        {regionOptions && monthOptions
          ? <CexFormInputs
              handleDateChange={handleDateChange}
              monthOptions={monthOptions}
              regionOptions={regionOptions}
              handleSelectedRegionsChange={handleSelectedRegionsChange}
              selectedRegions={selectedRegions}
              removeRegion={removeRegion}
              dateRange={dateRange}
              getData={getData}
              showChangeOptionsButton={showChangeOptionsButton}
              toggleShowOptionsModal={toggleShowOptionsModal}
              showOptionsModal={showOptionsModal}
            />
          : <Loader loadiingText="Building the inputs..." />
        }
        <div className="space-y-6">
          {sampleSizeData &&
            <CexSampleSize
              dateRange={dateRange}
              data={sampleSizeData}
            />
          }
          {sampleAgeData &&
            <div className="py-6 my-6 mx-4 border-2 rounded-lg">
              <div className="mx-6">
              <div className="relative my-4">
                <h1 className="inline text-3xl">Age</h1>
              </div>
              </div>
              <CexSampleAge
                dateRange={dateRange}
                data={sampleAgeData}
              />
            </div>
          }
          {sampleSexData &&
            <CexSampleSex
              dateRange={dateRange}
              data={sampleSexData}
            />
          }
          {sampleMaritalStatusData &&
            <CexSampleMaritalStatus
              dateRange={dateRange}
              data={sampleMaritalStatusData}
            />
          }
          {sampleEducationData &&
            <CexSampleEducation
              dateRange={dateRange}
              data={sampleEducationData}
            />
          }
          {sampleRaceData &&
            <CexSampleRace
              dateRange={dateRange}
              data={sampleRaceData}
            />
          }
          {sampleEarnersData &&
            <div className="py-6 my-6 mx-4 border-2 rounded-lg">
              <div className="mx-6">
              <div className="relative my-4">
                <h1 className="inline text-3xl">Household Earners</h1>
              </div>
              </div>
              <CexSampleEarners
                dateRange={dateRange}
                data={sampleEarnersData}
              />
            </div>
          }
        </div>
      </main>
    </div>
  )
}

export default cex