import { useState, useEffect } from "react"
import UbprFormInputs from "../src/components/UbprFormInputs"
import UbprBarChart from "../src/components/UbprBarChart"
import UbprBankSummary from "../src/components/UbprBankSummary"

import peerGroupOptions from "../src/data/peer_group_options_list.json"
import rconOptions from "../src/data/rcon_options_list.json"
import ubprOptions from "../src/data/ubpr_options_list.json"
import peerGroupStates from "../src/data/peer_group_states.json"
import pdnrlOptions from "../src/data/pdnrl_options.json"

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

  useEffect(() => {
      async function getPdnrlData(){
        const bankIdParam = bankData.length > 0 ? bankData.map(bank => bank.BANK_ID) : []
        const peerGroupParam = bankData.length > 0 ? bankData.map(bank => bank.PEER_GROUP) : []
        const pdnrlaCodes = selectedPdnrla.map(pdnrla => pdnrla.value)

        if(selectedPdnrla.length > 0 && startingQuarter && endingQuarter){
          let pdnrlaResponse = await fetch(
            '/api/get_ubpr_ratios_pdnrla_data',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ bankIdParam, peerGroupParam, pdnrlaCodes, startingQuarter, endingQuarter })
            }
          ).then(response => response.json())
          pdnrlaResponse = pdnrlaResponse.response
          const pdnrlaData = spliceIntoChunks(pdnrlaResponse, pdnrlaResponse.length / bankData.length)
          setPndrlaData(pdnrlaData)
        }
      }

      if(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState){
        getPdnrlData()
      }
  }, [bankData, selectedPdnrla, startingQuarter, endingQuarter])

  function exportBigTableToExcel(){
    if(document.getElementById('exportBigTable') !== null) {
      var downloadLink;
      var dataType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById('exportBigTable');
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      // Specify file name
      // filename = filename?filename+'.xls':'excel_data.xls';
      const filename = 'download.xls'

      // Create download link element
      downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['\ufeff', tableHTML], {
              type: dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

          // Setting the file name
          downloadLink.download = filename;

          //triggering the function
          downloadLink.click()
      }
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <UbprFormInputs
        bankNameOptions={bankNameOptionsList}
        peerGroupOptions={peerGroupOptions.peerGroupOptionsList}
        peerGroupStateOptions={peerGroupStates.peerGroupStateOptionsList}
        rconOptions={rconOptions.rconOptionsList}
        ubprOptions={ubprOptions.ubprOptionsList}
        pdnrlaOptions={pdnrlOptions.pdnrlOptionsList}
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
                  <div className="banking-charts-col mb-4">
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
                  <div className="banking-charts-col mb-4">
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
                    <div className="banking-charts-col mb-4">
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
                                  dataFlag={"pndrl"}
                                  statsData={pndrlaData[i]}
                                  selectedMetric={rcon}
                                />
                              </div>
                            )
                          }
                        })
                      }
                      {pndrlaData.length > 0 &&
                        <table id="exportBigTable" className="hidden">
                          <thead>
                            <tr>
                              <th>Quarter</th>
                              {selectedPdnrla.sort((a, b) => a.value > b.value).map(code => {
                                return (
                                  <th>{code.label}</th>
                                )
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {pndrlaData[0].map(obj => {
                              return (
                                <tr>
                                  <td>{obj.QUARTER.split('T')[0]}</td>
                                  {selectedPdnrla.map(item => {
                                    return (
                                      <td>{obj[item.value]}</td>
                                    )
                                  })}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      }
                      <div className="flex justify-center">
                        <button className="mx-auto py-2 px-6 border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-blue-50 rounded-md" onClick={exportBigTableToExcel}>Download CSV</button>
                      </div>
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