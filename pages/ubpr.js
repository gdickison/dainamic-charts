import { useState, useEffect } from "react"
import UbprFormInputs from "../src/components/UbprFormInputs"
import UbprBarChart from "../src/components/UbprBarChart"
import UbprBankSummary from "../src/components/UbprBankSummary"
import {
  rconSelectOptions,
  ubprSelectOptions,
  peerGroupAssetOptions,
  peerGroupHighOfficesOptions,
  peerGroupLowOfficesOptions,
  peerGroupLocationOptions,
  peerGroupStateOptions
 } from "../public/utils"

const UBPR = () => {
  const [ubprBankData, setUbprBankData] = useState()
  const [ubprRconData, setUbprRconData] = useState()
  const [ubprCreditConcentrationData, setUbprCreditConcentrationData] = useState()
  const [specializationParam, setSpecializationParam] = useState('')
  const [cityParam, setCityParam] = useState('')
  const [stateParam, setStateParam] = useState('')
  const [fdicRegionParam, setFdicRegionParam] = useState('')
  const [selectedRcons, setSelectedRcons] = useState([])
  const [selectedUbprs, setSelectedUbprs] = useState([])
  const [quarters, setQuarters] = useState()
  const [startingQuarter, setStartingQuarter] = useState()
  const [endingQuarter, setEndingQuarter] = useState()

  const [bankNames, setBankNames] = useState()
  const [selectedBanks, setSelectedBanks] = useState([])

  const [selectedAssetOption, setSelectedAssetOption] = useState(null)

  const [selectedNumberOfOffices, setSelectedNumberOfOffices] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [selectedPeerGroupState, setSelectedPeerGroupState] = useState(null)

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const closeAlert = () => {
    setShowAlert(false)
    setAlertMessage('')
  }

  function handleSelectedBankChange(selectedBanks){
    setSelectedBanks(selectedBanks)
  }

  function handlePeerGroupAssetOptionChange(selectedAssetOption){
    setSelectedAssetOption(selectedAssetOption)
    setSelectedNumberOfOffices(null)
  }

  function handleNumberOfOfficesChange(selectedNumberOfOffices){
    setSelectedNumberOfOffices(selectedNumberOfOffices)
  }

  function handleSelectedLocationChange(selectedLocation){
    setSelectedLocation(selectedLocation)
  }

  function handleSelectedPeerGroupStateChange(selectedPeerGroupState){
    setSelectedPeerGroupState(selectedPeerGroupState)
  }

  const handleSpecializationParamChange = e => {
    e.preventDefault()
    setSpecializationParam(e.target.value)
  }

  const handleStateParamChange = e => {
    e.preventDefault()
    setStateParam(e.target.value)
  }

  const handleCityParamChange = e => {
    e.preventDefault()
    setCityParam(e.target.value)
  }

  const handleFdicRegionChange = e => {
    e.preventDefault()
    setFdicRegionParam(e.target.value)
  }

  const spliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
  }

  const getQuarters = async () => {
    const quartersEndpoint = `/api/get_ubpr_quarters`
    const quartersOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let quartersResponse = await fetch(quartersEndpoint, quartersOptions).then(response => response.json())
    quartersResponse = quartersResponse.response.map(row => {
      return ({
        value: row.QUARTER,
        label: row.QUARTER
      })
    })
    setQuarters(quartersResponse)
  }

  async function getBankNames(){
    const bankNamesEndpoint = `/api/get_ubpr_bank_names`
    const bankNameOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let bankNamesResponse = await fetch(bankNamesEndpoint, bankNameOptions).then(response => response.json())
    bankNamesResponse =  bankNamesResponse.response.map(row => {
      return ({
        value: row.BANK_ID,
        label: `${row.NAME} (${row.BANK_ID})`,
      })
    })
    setBankNames(bankNamesResponse)
  }

  useEffect(() => {
    getQuarters()
    getBankNames()
  }, [])

  function handleStartingQuarterChange (startingQuarter) {
    setStartingQuarter(startingQuarter)
  }

  function handleEndingQuarterChange(endingQuarter){
    setEndingQuarter(endingQuarter)
  }

  const getUbprBankData = async () => {
    // make sure search params are present
    if(selectedBanks.length === 0 && selectedAssetOption === null && selectedPeerGroupState === null){
      setShowAlert(true)
      setAlertMessage("You must select at least one bank or a peer group")
    }
    // get basic bank information
    const bankEndpoint = `/api/get_ubpr_institution`
    const bankIdParam = selectedBanks.map(bank => bank.value)
    const JSONdata = JSON.stringify({
      bankIdParam,
      specializationParam,
      stateParam,
      fdicRegionParam,
      cityParam
    })

    const bankOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    let banks = await fetch(bankEndpoint, bankOptions).then(response => response.json())
    banks = banks.response
    setUbprBankData(banks)

    // get rcon data
    const rconEndpoint = `/api/get_ubpr_rcon`
    const rconCodes = selectedRcons.map(rcon => rcon.value)

    const rconOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bankIdParam, rconCodes })
    }

    if(selectedRcons.length > 0){
      let rcon = await fetch(rconEndpoint, rconOptions).then(response => response.json())
      rcon = rcon.response
      const rconData = spliceIntoChunks(rcon, rcon.length / banks.length)
      setUbprRconData(rconData)
    }

    // get ubpr data
    const creditConcentrationEndpoint = `/api/get_ubpr_credit_concentrations`
    const ubprCodes = selectedUbprs.map(ubpr => ubpr.value)
    const ubprOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bankIdParam, startingQuarter, endingQuarter, ubprCodes })
    }

    if(selectedUbprs.length > 0 && (startingQuarter === undefined || endingQuarter === undefined)) {
      setShowAlert(true)
      setAlertMessage("You must select both starting and ending quarters")
    }

    if(selectedUbprs.length > 0 && startingQuarter && endingQuarter){
      let creditConcentration = await fetch(creditConcentrationEndpoint, ubprOptions).then(response => response.json())
      creditConcentration = creditConcentration.response
      const ubprData = spliceIntoChunks(creditConcentration, creditConcentration.length / banks.length)
      setUbprCreditConcentrationData(ubprData)
    }
  }

  const getData = async () => {
    setUbprBankData(null)
    setUbprRconData(null)
    setUbprCreditConcentrationData(null)
    getUbprBankData()
  }

  function handleSelectedRconChange(data){
    setSelectedRcons(data)
  }

  function handleSelectedUbprChange (data) {
    setSelectedUbprs(data)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <UbprFormInputs
        handleSpecializationParamChange={handleSpecializationParamChange}
        handleCityParamChange= {handleCityParamChange}
        handleStateParamChange={handleStateParamChange}
        handleFdicRegionChange={handleFdicRegionChange}
        getData={getData}
        handleSelectedRconChange={handleSelectedRconChange}
        selectedRcons={selectedRcons}
        handleSelectedUbprChange={handleSelectedUbprChange}
        selectedUbprs={selectedUbprs}
        quarters={quarters}
        handleStartingQuarterChange={handleStartingQuarterChange}
        startingQuarter={startingQuarter}
        handleEndingQuarterChange={handleEndingQuarterChange}
        endingQuarter={endingQuarter}
        showAlert={showAlert}
        alertMessage={alertMessage}
        closeAlert={closeAlert}
        rconOptionsList={rconSelectOptions}
        ubprOptionsList={ubprSelectOptions}
        bankNameOptions={bankNames}
        selectedBanks={selectedBanks}
        handleSelectedBankChange={handleSelectedBankChange}
        peerGroupAssetOptions={peerGroupAssetOptions}
        selectedAssetOption={selectedAssetOption}
        handlePeerGroupAssetOptionChange={handlePeerGroupAssetOptionChange}
        peerGroupHighOfficesOptions={peerGroupHighOfficesOptions}
        peerGroupLowOfficesOptions={peerGroupLowOfficesOptions}
        selectedNumberOfOffices={selectedNumberOfOffices}
        handleNumberOfOfficesChange={handleNumberOfOfficesChange}
        peerGroupLocationOptions={peerGroupLocationOptions}
        selectedLocation={selectedLocation}
        handleSelectedLocationChange={handleSelectedLocationChange}
        peerGroupStateOptions={peerGroupStateOptions}
        selectedPeerGroupState={selectedPeerGroupState}
        handleSelectedPeerGroupStateChange={handleSelectedPeerGroupStateChange}
      />
      <section className="m-4 space-y-10">
        {ubprBankData &&
          ubprBankData.map((bank, i) => {
            return (
              <div className="border-2 border-gray-400" key={i}>
                <UbprBankSummary
                  bankData={bank}
                />
                <div className="ubpr-charts">
                  <div className="ubpr-charts-col">
                    {ubprRconData &&
                      <h1>Loans & Leases (RCON)</h1>
                    }
                    {ubprRconData &&
                      selectedRcons.map((rcon, idx) => {
                        return (
                          <div key={idx} className="">
                            <UbprBarChart
                              bankData={bank}
                              dataFlag={"rcon"}
                              statsData={ubprRconData[i]}
                              selectedMetric={rcon}
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="ubpr-charts-col">
                    {ubprCreditConcentrationData &&
                      <h1>Credit Concetrations (UBPR)</h1>
                    }
                    {ubprCreditConcentrationData &&
                      selectedUbprs.map((rcon, idx) => {
                        return (
                          <div key={idx} className="">
                            <UbprBarChart
                              bankData={bank}
                              dataFlag={"ubpr"}
                              statsData={ubprCreditConcentrationData[i]}
                              selectedMetric={rcon}
                            />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
      </section>
    </div>
  )
}

export default UBPR