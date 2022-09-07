import { useEffect, useState, memo } from "react"

import CexFormInputs from "../src/components/CexFormInputs"
import Loader from "../src/components/Loader"

const cex = () => {
  const [isLoading, setLoading] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState("inline")
  const [showChangeOptionsButton, setShowChangeOptionsButton] = useState("hidden")
  const [regionOptions, setRegionOptions] = useState()
  const [monthOptions, setMonthOptions] = useState()
  const [dateRange, setDateRange] = useState({})
  const [selectedRegions, setSelectedRegions] = useState([])

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
    data.unshift({region: '0', region_name: 'All Regions'})

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

    const months = data.map(row => {
      return `${row.month_name.trim()} ${row.year}`
    })

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMonthOptions(months)
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

  const getData = () => {
    setShowOptionsModal("hidden")
    setShowChangeOptionsButton("flex")
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
      </main>
    </div>
  )
}

export default cex