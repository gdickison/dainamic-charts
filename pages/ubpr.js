import { useState, useEffect, useLayoutEffect } from "react"
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
  const [bankNameOptions, setBankNameOptions] = useState()
  const [selectedBanksByName, setSelectedBanksByName] = useState([])

  const [selectedAssetOption, setSelectedAssetOption] = useState(null)
  const [selectedNumberOfOffices, setSelectedNumberOfOffices] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [selectedPeerGroupState, setSelectedPeerGroupState] = useState(null)

  const [selectedRcons, setSelectedRcons] = useState([])
  const [ubprRconData, setUbprRconData] = useState(null)

  const [quarters, setQuarters] = useState()

  const [selectedInstitutionsData, setSelectedInstitutionsData] = useState()
  const [ubprCreditConcentrationData, setUbprCreditConcentrationData] = useState(null)
  const [selectedUbprs, setSelectedUbprs] = useState([])
  const [startingQuarter, setStartingQuarter] = useState()
  const [endingQuarter, setEndingQuarter] = useState()

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const closeAlert = () => {
    setShowAlert(false)
    setAlertMessage('')
  }

  function handleSelectedBanksByNameChange(selectedBanksByName){
    setSelectedAssetOption(null)
    setSelectedNumberOfOffices(null)
    setSelectedLocation(null)
    setSelectedPeerGroupState(null)
    setSelectedBanksByName(selectedBanksByName)
  }

  function handlePeerGroupAssetOptionChange(selectedAssetOption){
    setSelectedAssetOption(selectedAssetOption)
    setSelectedBanksByName([])
    setSelectedPeerGroupState(null)
    setSelectedNumberOfOffices(null)
  }

  function handleNumberOfOfficesChange(selectedNumberOfOffices){
    setSelectedNumberOfOffices(selectedNumberOfOffices)
  }

  function handleSelectedLocationChange(selectedLocation){
    setSelectedLocation(selectedLocation)
  }

  function handleSelectedPeerGroupStateChange(selectedPeerGroupState){
    setSelectedBanksByName([])
    setSelectedAssetOption(null)
    setSelectedNumberOfOffices(null)
    setSelectedLocation(null)
    setSelectedPeerGroupState(selectedPeerGroupState)
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
    let bankNames = await fetch(bankNamesEndpoint, bankNameOptions).then(response => response.json())
    bankNames =  bankNames.response.map(row => {
      return ({
        value: row.BANK_ID,
        label: `${row.NAME} (${row.BANK_ID})`,
      })
    })
    setBankNameOptions(bankNames)
  }

  useEffect(() => {
    getBankNames()
    getQuarters()
  }, [])

  function handleStartingQuarterChange (startingQuarter) {
    setStartingQuarter(startingQuarter)
  }

  function handleEndingQuarterChange(endingQuarter){
    setEndingQuarter(endingQuarter)
  }

  async function getSelectedInstitutionsData() {
    // make sure search params are present and set alerts if not
    if(selectedBanksByName.length === 0 && selectedAssetOption === null && selectedPeerGroupState === null){
      setShowAlert(true)
      setAlertMessage("You must select at least one bank or a peer group")
      return
    }

    if(selectedUbprs.length > 0 && (startingQuarter === undefined || endingQuarter === undefined)) {
      setShowAlert(true)
      setAlertMessage("You must select both starting and ending quarters")
      return
    }

    if(selectedAssetOption !== null && (selectedAssetOption.value === "BETWEEN 100000 AND 300000" || selectedAssetOption.value === "BETWEEN 50000 AND 100000" || selectedAssetOption.value === "< 50000") && (selectedNumberOfOffices === null || selectedLocation === null)){
      setShowAlert(true)
      setAlertMessage("You must select number of offices and location")
      return
    }

    // get basic bank information
    const bankEndpoint = `/api/get_ubpr_institution`
    const selectedBanksParam = selectedBanksByName.map(bank => bank.value)

    const JSONdata = JSON.stringify({
      selectedBanksParam,
      selectedAssetOption,
      selectedNumberOfOffices,
      selectedLocation,
      selectedPeerGroupState
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

    const bankIdParam = banks ? banks.map(bank => bank.BANK_ID) : []

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

    if(selectedUbprs.length > 0 && startingQuarter && endingQuarter){
      let creditConcentration = await fetch(creditConcentrationEndpoint, ubprOptions).then(response => response.json())
      creditConcentration = creditConcentration.response
      const ubprData = spliceIntoChunks(creditConcentration, creditConcentration.length / banks.length)
      setUbprCreditConcentrationData(ubprData)
    }

    setSelectedInstitutionsData(banks)
  }

//   async function getRconData(){
// console.log('getRconData was called')
//     const bankIdParam = selectedInstitutionsData ? selectedInstitutionsData.map(bank => bank.BANK_ID) : []
//     // get rcon data
//     const rconEndpoint = `/api/get_ubpr_rcon`
//     const rconCodes = selectedRcons.map(rcon => rcon.value)

//     const rconOptions = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ bankIdParam, rconCodes })
//     }

//     if(selectedRcons.length > 0){
//       let rcon = await fetch(rconEndpoint, rconOptions).then(response => response.json())
//       rcon = rcon.response
//       const rconData = spliceIntoChunks(rcon, rcon.length / selectedInstitutionsData.length)
//       // const rconData = spliceIntoChunks(rcon, rcon.length / banks.length)
//       setUbprRconData(rconData)
//     }
//   }

  // async function getUbprData(){
  //   const bankIdParam = selectedInstitutionsData ? selectedInstitutionsData.map(bank => bank.BANK_ID) : []
  //   const creditConcentrationEndpoint = `/api/get_ubpr_credit_concentrations`
  //   const ubprCodes = selectedUbprs.map(ubpr => ubpr.value)
  //   const ubprOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ bankIdParam, startingQuarter, endingQuarter, ubprCodes })
  //   }

  //   if(selectedUbprs.length > 0 && startingQuarter && endingQuarter){
  //     let creditConcentration = await fetch(creditConcentrationEndpoint, ubprOptions).then(response => response.json())
  //     creditConcentration = creditConcentration.response
  //     const ubprData = spliceIntoChunks(creditConcentration, creditConcentration.length / selectedInstitutionsData.length)
  //     // const ubprData = spliceIntoChunks(creditConcentration, creditConcentration.length / banks.length)
  //     setUbprCreditConcentrationData(ubprData)
  //   }
  // }

  const getData = async () => {
    setSelectedInstitutionsData(null)
    setUbprRconData(null)
    setUbprCreditConcentrationData(null)
    getSelectedInstitutionsData()
    // getRconData()
    // getUbprData()
  }

//   useEffect(() => {
//     selectedBanksByName.length === 0
//       ? setSelectedInstitutionsData(null)
//       : getSelectedInstitutionsData()
//   }, [selectedBanksByName])

//   useEffect(() => {
//     if(selectedAssetOption !== null){ getSelectedInstitutionsData()}
//   }, [selectedAssetOption, selectedNumberOfOffices, selectedLocation])

//   useEffect(() => {
//     if(selectedPeerGroupState !== null){
//       getSelectedInstitutionsData()
//     }
//   }, [selectedPeerGroupState])

//   useEffect(() => {
// console.log('this useEffect was called')
//     selectedInstitutionsData !== null && selectedRcons.length > 0
//       ? getRconData()
//       : setUbprRconData(null)
//   }, [selectedInstitutionsData, selectedRcons])

// console.log('selectedInstitutionsData', selectedInstitutionsData)
// console.log('selectedRcons', selectedRcons)
// console.log('ubprRconData', ubprRconData)

  function handleSelectedRconChange(data){
    setSelectedRcons(data)
  }

  function handleSelectedUbprChange (data) {
    setSelectedUbprs(data)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <UbprFormInputs
        bankNameOptions={bankNameOptions}
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
        selectedBanksByName={selectedBanksByName}
        handleSelectedBanksByNameChange={handleSelectedBanksByNameChange}
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
        {selectedInstitutionsData &&
          selectedInstitutionsData.map((bank, i) => {
            return (
              <div className="shadow-xl rounded-b-md" key={i}>
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