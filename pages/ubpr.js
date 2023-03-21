import { useState, useEffect } from "react"
import UbprFormInputs from "../src/components/UbprFormInputs"
import UbprBarChart from "../src/components/UbprBarChart"
import UbprBankSummary from "../src/components/UbprBankSummary"

import { peerGroupOptionsList } from "../src/data/peer_group_options_list.json"
import { rconOptionsList } from "../src/data/rcon_options_list.json"
import { ubprOptionsList } from "../src/data/ubpr_options_list.json"
import { peerGroupStateOptionsList } from "../src/data/peer_group_states.json"
import { pdnrlOptions } from "../src/data/pdnrl_options.json"

const UBPR = () => {
  const [bankNameOptionsList, setBankNameOptionsList] = useState()
  const [quartersOptionsList, setQuartersOptionsList] = useState()
  const [startingQuarter, setStartingQuarter] = useState()
  const [endingQuarter, setEndingQuarter] = useState()

  const [selectedBankNames, setSelectedBanksByName] = useState([])
  const [selectedPeerGroup, setSelectedPeerGroup] = useState(null)
  const [selectedPeerGroupState, setSelectedPeerGroupState] = useState(null)
  const [selectedBanks, setSelectedBanks] = useState()
  const [selectedRcons, setSelectedRcons] = useState([])
  const [selectedUbprs, setSelectedUbprs] = useState([])
  const [selectedPdnrla, setSelectedPdnrla] = useState([])

  const [bankData, setBankData] = useState([])
  const [bankRconData, setBankRconData] = useState([])
  const [bankUbprData, setBankUbprData] = useState([])
  const [pndrlaData, setPndrlaData] = useState([])

  // get the bank names/codes and available quarters to populate the select inputs
  async function getBankNames(){
    let bankNames = await fetch(
      '/api/get_bank_names',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())

    bankNames =  bankNames.response.map(row => {
      return ({
        value: row.BANK_ID,
        label: `${row.NAME} (${row.BANK_ID})`,
      })
    })

    setBankNameOptionsList(bankNames)
  }

  async function getQuarters(){
    let quartersResponse = await fetch(
      '/api/get_ubpr_quarters',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())

    quartersResponse = quartersResponse.response.map(row => {
      return ({
        value: row.QUARTER.split('T')[0],
        label: row.QUARTER.split('T')[0]
      })
    })

    setQuartersOptionsList(quartersResponse)
    setStartingQuarter(quartersResponse[quartersResponse.length - 4])
    setEndingQuarter(quartersResponse[quartersResponse.length - 1])
  }

  useEffect(() => {
    getBankNames()
    getQuarters()
  }, [])


  // select input change handlers
  function handleSelectedBankNamesChange(selectedBankNames){
    setSelectedPeerGroupState(null)
    setSelectedPeerGroup(null)
    setSelectedBanksByName(selectedBankNames)
    setSelectedBanks(selectedBankNames)
  }

  function handleSelectedPeerGroupChange(selectedPeerGroup){
    setSelectedBanksByName([])
    setSelectedPeerGroupState(null)
    setSelectedPeerGroup(selectedPeerGroup)
    setSelectedBanks(selectedPeerGroup)
  }

  function handleSelectedPeerGroupStateChange(selectedPeerGroupState){
    setSelectedBanksByName([])
    setSelectedPeerGroup(null)
    setSelectedPeerGroupState(selectedPeerGroupState)
    setSelectedBanks(selectedPeerGroupState)
  }

  function handleSelectedRconChange(data){
    setSelectedRcons(data)
  }

  function handleSelectedUbprChange (data) {
    setSelectedUbprs(data)
  }

  function handleSelectedPdnrlaChange (data) {
    setSelectedPdnrla(data)
  }

  function handleStartingQuarterChange (startingQuarter) {
    setStartingQuarter(startingQuarter)
  }

  function handleEndingQuarterChange(endingQuarter){
    setEndingQuarter(endingQuarter)
  }

  async function getBankData() {
    const selectedBanksParam = !selectedBanks.metric ? selectedBanks.map(bank => bank.value) : selectedBanks

    const JSONdata = JSON.stringify({
      selectedBanksParam
    })

    let banks = await fetch(
      '/api/get_bank_data',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSONdata
      }).then(response => response.json())
    banks = banks.response

    setBankData(banks)
  }

  useEffect(() => {
    if(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState){
      getBankData()
    } else {
      setBankData([])
    }
  }, [selectedBanks])

  function spliceIntoChunks (arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
  }

  useEffect(() => {
    async function getBankRconData(){
      const bankIdParam = bankData.length > 0 ? bankData.map(bank => bank.BANK_ID) : []
      const rconCodes = selectedRcons.map(rcon => rcon.value)

      if(selectedRcons.length > 0 && startingQuarter && endingQuarter){
        let rcon = await fetch(
          '/api/get_ubpr_rcci_data',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bankIdParam, startingQuarter, endingQuarter, rconCodes })
          }).then(response => response.json())
        rcon = rcon.response
        const rconData = spliceIntoChunks(rcon, rcon.length / bankData.length)

        setBankRconData(rconData)
      }
    }

    if(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState){
      getBankRconData()
    }
  }, [bankData, selectedRcons, startingQuarter, endingQuarter])

  useEffect(() => {
    async function getBankUbprData(){
      const bankIdParam = bankData.length > 0 ? bankData.map(bank => bank.BANK_ID) : []
      const ubprCodes = selectedUbprs.map(ubpr => ubpr.value)

      if(selectedUbprs.length > 0 && startingQuarter && endingQuarter){
        let creditConcentration = await fetch(
          '/api/get_ubpr_ratios_coc_data',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bankIdParam, startingQuarter, endingQuarter, ubprCodes })
          }).then(response => response.json())
        creditConcentration = creditConcentration.response
        const ubprData = spliceIntoChunks(creditConcentration, creditConcentration.length / bankData.length)
        setBankUbprData(ubprData)
      }
    }

    if(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState){
      getBankUbprData()
    }
  }, [bankData, selectedUbprs, startingQuarter, endingQuarter])

  useEffect(() => { // currently this data exist only for Lineage Bank - remove if/else when there is more data
    if(bankData.length > 0){
      async function getPdnrlData(){
        const peerGroupParam = bankData.length > 0 ? bankData.map(bank => bank.PEER_GROUP) : []
        const pdnrlaCodes = selectedPdnrla.map(pdnrla => pdnrla.value)

        if(selectedPdnrla.length > 0 && startingQuarter && endingQuarter){
          let pdnrlaThingy = await fetch(
            '/api/get_ubpr_ratios_pdnrla_data',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ peerGroupParam, pdnrlaCodes, startingQuarter, endingQuarter })
            }
          ).then(response => response.json())
          pdnrlaThingy = pdnrlaThingy.response
          const pdnrlaData = spliceIntoChunks(pdnrlaThingy, pdnrlaThingy.length / bankData.length)
          setPndrlaData(pdnrlaData)
        }
      }

      if(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState){
        getPdnrlData()
      }
    } else {
      setPndrlaData([]) // currently this data exist only for Lineage Bank
    }
  }, [bankData, selectedPdnrla, startingQuarter, endingQuarter])

  return (
    <div className="max-w-[1600px] mx-auto">
      <UbprFormInputs
        bankNameOptions={bankNameOptionsList}
        peerGroupOptions={peerGroupOptionsList}
        peerGroupStateOptions={peerGroupStateOptionsList}
        rconOptions={rconOptionsList}
        ubprOptions={ubprOptionsList}
        pdnrlaOptions={pdnrlOptions}
        quartersOptions={quartersOptionsList}

        selectedBankNames={selectedBankNames}
        selectedPeerGroup={selectedPeerGroup}
        selectedPeerGroupState={selectedPeerGroupState}
        selectedRcons={selectedRcons}
        selectedUbprs={selectedUbprs}
        selectedPdnrla={selectedPdnrla}
        startingQuarter={startingQuarter}
        endingQuarter={endingQuarter}

        handleSelectedBankNamesChange={handleSelectedBankNamesChange}
        handleSelectedPeerGroupChange={handleSelectedPeerGroupChange}
        handleSelectedPeerGroupStateChange={handleSelectedPeerGroupStateChange}
        handleSelectedRconChange={handleSelectedRconChange}
        handleSelectedUbprChange={handleSelectedUbprChange}
        handleSelectedPdnrlaChange={handleSelectedPdnrlaChange}
        handleStartingQuarterChange={handleStartingQuarterChange}
        handleEndingQuarterChange={handleEndingQuarterChange}
      />
      <section className="m-4 space-y-10">
        {bankData.length > 0 &&
          bankData.map((bank, i) => {
            return (
              <div className="shadow-xl rounded-b-md" key={bank.BANK_ID}>
                <UbprBankSummary
                  bankData={bank}
                />
                <div className="banking-charts">
                  <div className="banking-charts-col">
                    {bankRconData.length > 0 && selectedRcons.length > 0 &&
                      <h1>Loans & Leases (RCON)</h1>
                    }
                    {bankRconData.length > 0 &&
                      selectedRcons.map((rcon) => {
                        if(typeof bankRconData[i] !== 'undefined'){
                          return (
                            <div key={rcon.value} className="">
                              <UbprBarChart
                                bankData={bank}
                                dataFlag={"rcon"}
                                statsData={bankRconData[i]}
                                selectedMetric={rcon}
                              />
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                  <div className="banking-charts-col">
                    {bankUbprData.length > 0 && selectedUbprs.length > 0 &&
                      <h1>Credit Concentrations (UBPR)</h1>
                    }
                    {bankUbprData.length > 0 &&
                      selectedUbprs.map((rcon) => {
                        if(typeof bankUbprData[i] !== 'undefined'){
                          return (
                            <div key={rcon.value} className="">
                              <UbprBarChart
                                bankData={bank}
                                dataFlag={"ubpr"}
                                statsData={bankUbprData[i]}
                                selectedMetric={rcon}
                              />
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                  {selectedBankNames.length > 0 &&
                    <div className="banking-charts-col">
                      {pndrlaData.length > 0 && selectedPdnrla.length > 0 &&
                        <h1>Past Due, Nonaccrual & Restructured Loans</h1>
                      }
                      {pndrlaData.length > 0 &&
                        selectedPdnrla.map((rcon) => {
                          if(typeof pndrlaData[i] !== 'undefined'){
                            return (
                              <div key={rcon.value} className="">
                                <UbprBarChart
                                  bankData={bank}
                                  dataFlag={"ubpr"}
                                  statsData={pndrlaData[i]}
                                  selectedMetric={rcon}
                                />
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                  }
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