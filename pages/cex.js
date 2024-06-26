import { useEffect, useState } from "react"

import CexFormInputs from "../src/components/CexFormInputs"
import Loader from "../src/components/Loader"
import CexSampleSize from "../src/components/CexSampleSize"
import CexAge from "../src/components/CexAge"
import CexSex from "../src/components/CexSex"
import CexMaritalStatus from "../src/components/CexMaritalStatus"
import CexEducation from "../src/components/CexEducation"
import CexRace from "../src/components/CexRace"
import CexEarners from "../src/components/CexEarners"

const cex = () => {
  const [isLoading, setLoading] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState("inline")
  const [showChangeOptionsButton, setShowChangeOptionsButton] = useState("hidden")
  const [regionOptions, setRegionOptions] = useState()
  const [monthOptions, setMonthOptions] = useState()
  const [dateRange, setDateRange] = useState({})
  const [selectedRegions, setSelectedRegions] = useState([])

  const [openTab, setOpenTab] = useState("age");

  const [cexSampleSizeData, setCexSampleSizeData] = useState()
  const [cexAgeData, setCexAgeData] = useState()
  const [cexSexData, setCexSexData] = useState()
  const [cexMaritalStatusData, setCexMaritalStatusData] = useState()
  const [cexEducationData, setCexEducationData] = useState()
  const [cexRaceData, setCexRaceData] = useState()
  const [cexEarnersData, setCexEarnersData] = useState()

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
      setCexSampleSizeData(data)
    }
  }

  const getCexAge = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_age`

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
      setCexAgeData(data)
    }
  }

  const getCexSex = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_sex`

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
      setCexSexData(data)
    }
  }

  const getCexMaritalStatus = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_marital_status`

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
      setCexMaritalStatusData(data)
    }
  }

  const getCexEducation = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_education`

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
      setCexEducationData(data)
    }
  }

  const getCexRace = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_race`

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
      setCexRaceData(data)
    }
  }

  const getCexEarners = async () => {
    const regions = selectedRegions.map(region => {
      return region.regionCode
    })

    const JSONdata = JSON.stringify({
      regions,
      startDate: dateRange.startDate.split('T')[0],
      endDate: dateRange.endDate.split('T')[0]
    })

    const endpoint = `/api/cex_earners`

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
      setCexEarnersData(data)
    }
  }

  const getData = () => {
    setShowOptionsModal("hidden")
    setShowChangeOptionsButton("flex")
    getSampleSize()
    getCexAge()
    getCexSex()
    getCexMaritalStatus()
    getCexEducation()
    getCexRace()
    getCexEarners()
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
          {cexSampleSizeData &&
            <CexSampleSize
              dateRange={dateRange}
              data={cexSampleSizeData}
            />
          }
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center mt-12">
              {cexSampleSizeData &&
                <ul className="flex space-x-2">
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("age")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "age" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Age
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("sex")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "sex" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Sex
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("marital")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "marital" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Marital Status
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("education")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "education" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Education
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("race")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "race" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Race
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setOpenTab("earner")}
                      className={`inline-block px-6 border-2 border-gray-300 py-2 text-2xl ${openTab === "earner" ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white hover:bg-gray-300'} rounded shadow-md`}
                    >
                      Earner
                    </a>
                  </li>
                </ul>
              }
              <div className="mt-6 bg-white w-full">
                <div className={openTab === "age" ? "block" : "hidden"}>
                  {cexAgeData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                        <div className="relative my-4">
                          <h1 className="inline text-3xl">Age</h1>
                        </div>
                      </div>
                      <CexAge
                        dateRange={dateRange}
                        data={cexAgeData}
                      />
                    </div>
                  }
                </div>
                <div className={openTab === "sex" ? "block" : "hidden"}>
                  {cexSexData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                        <div className="relative my-4">
                          <h1 className="inline text-3xl">Sex</h1>
                        </div>
                      </div>
                      <CexSex
                        dateRange={dateRange}
                        data={cexSexData}
                      />
                    </div>
                  }
                </div>
                <div className={openTab === "marital" ? "block" : "hidden"}>
                  {cexMaritalStatusData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                        <div className="relative my-4">
                          <h1 className="inline text-3xl">Marital Status</h1>
                        </div>
                      </div>
                      <CexMaritalStatus
                        dateRange={dateRange}
                        data={cexMaritalStatusData}
                      />
                    </div>
                  }
                </div>
                <div className={openTab === "education" ? "block" : "hidden"}>
                  {cexEducationData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                        <div className="relative my-4">
                          <h1 className="inline text-3xl">Education</h1>
                        </div>
                      </div>
                      <CexEducation
                        dateRange={dateRange}
                        data={cexEducationData}
                      />
                    </div>
                  }
                </div>
                <div className={openTab === "race" ? "block" : "hidden"}>
                  {cexRaceData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                        <div className="relative my-4">
                          <h1 className="inline text-3xl">Race</h1>
                        </div>
                      </div>
                      <CexRace
                        dateRange={dateRange}
                        data={cexRaceData}
                      />
                    </div>
                  }
                </div>
                <div className={openTab === "earner" ? "block" : "hidden"}>
                  {cexEarnersData &&
                    <div className="py-6 my-6 mx-4 border-2 rounded-lg">
                      <div className="mx-6">
                      <div className="relative my-4">
                        <h1 className="inline text-3xl">Household Earners</h1>
                      </div>
                      </div>
                      <CexEarners
                        dateRange={dateRange}
                        data={cexEarnersData}
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default cex